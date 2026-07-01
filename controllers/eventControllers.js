import { db } from '../src/db.js';
import { events } from '../src/models/event.js';
import { registrations } from '../src/models/registration.js';
import { users } from '../src/models/user.js';
import { eq, desc, sql } from 'drizzle-orm';
import { goals }from '../src/models/goal.js';
import { eventMedia } from '../src/models/eventMedia.js';
import path from 'path';
import fs from 'fs';
const parseEvent = (event) => {
   
 const mediaList = event.media || [];
    
    const cleanUrl = (url) => {
        if (!url) return null;
        const clean = url.replace(/([^:]\/)\/+/g, "$1").trim();
        return clean.startsWith('http') ? clean :` http://localhost:4000/${clean.replace(/^\/+/, '')}`;
    };

    const poster = mediaList.find(m => m.mediaType === "image" || m.mediaType === "event_poster")?.mediaUrl;
    const speaker = mediaList.find(m => m.mediaType === "speaker_image")?.mediaUrl;
    
    return {
        ...event,
        event_id: event.id,
        agenda: event.agenda ? JSON.parse(event.agenda) : [],
        featured: event.featured === 1,
        img: poster ? cleanUrl(poster) : null,
        speakerImg: speaker ? cleanUrl(speaker) : null,
    };
};
export const createEvent = async (req, res) => {
  try {
    let { agenda, featured, id, ...data } = req.body;

    delete data.id;

    let agendaParsed = [];
    if (typeof agenda === "string") {
      try {
        agendaParsed = JSON.parse(agenda);
      } catch {
        agendaParsed = [];
      }
    }

    const featuredValue =
      featured === "true" ||
      featured === true ||
      featured === "1" ||
      featured === 1
        ? 1
        : 0;

    await db.insert(events).values({
      ...data,
      organizerId: data.organizerId ? Number(data.organizerId) : null,
      agenda: JSON.stringify(agendaParsed),
      featured: featuredValue,
    });

    const newEvent = await db.query.events.findFirst({
      orderBy: (events, { desc }) => [desc(events.id)],
    });

    const poster = req.files?.img?.[0];
    const speaker = req.files?.speakerImg?.[0];

    if (poster) {
      await db.insert(eventMedia).values({
        event_id: newEvent.id,
        mediaUrl:` /uploads/${poster.filename}`,
        mediaType: "event_poster",
      });
    }

    if (speaker) {
      await db.insert(eventMedia).values({
        event_id: newEvent.id,
        mediaUrl: `/uploads/${speaker.filename}`,
        mediaType: "speaker_image",
      });
    }

    const eventWithMedia = await db.query.events.findFirst({
      where: eq(events.id, newEvent.id),
      with: {
        media: true,
      },
    });

    res.status(201).json(parseEvent(eventWithMedia));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "خطأ أثناء إنشاء الفعالية",
      error: error.message,
    });
  }
};
export const getActiveEvents = async (req, res) => {
    try {
        const active = await db.query.events.findMany({
            where: (events, { gt }) => gt(events.date, new Date().toISOString().split('T')[0]),
            with : {media : true}

        });
        res.status(200).json(active.map(parseEvent));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArchiveEvents = async (req, res) => {
    try {
        const archive = await db.query.events.findMany({
            where: (events, { lte }) => lte(events.date, new Date().toISOString().split('T')[0]),
            with : {media : true}
        });
        res.status(200).json(archive.map(parseEvent));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSingleEvent = async (req, res) => {
    try {
        const event = await db.query.events.findFirst({
            where: eq(events.id, Number(req.params.id)),
            with: { media: true }
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        
        res.status(200).json(parseEvent(event));
    } catch (error) {
        res.status(500).json({ message: "Error fetching event", error: error.message });
    }
};

export const getLatestEvents = async (req, res) => {
    try {
        const latest = await db.query.events.findMany({
            orderBy: desc(events.date),
            limit: 3,
            with: { media: true }
        });
        res.status(200).json(latest.map(parseEvent));
    } catch (error) {
        res.status(500).json({ message: "Error fetching latest events", error: error.message });
    }};
   export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    let agendaData = req.body.agenda;

    if (typeof agendaData === "string") {
      try {
        agendaData = JSON.parse(agendaData);
      } catch {
        agendaData = [];
      }
    }

    const featuredValue =
      req.body.featured === "true" ||
      req.body.featured === true ||
      req.body.featured === "1" ||
      req.body.featured === 1
        ? 1
        : 0;

    const { agenda, featured, ...data } = req.body;

    await db.transaction(async (tx) => {
      await tx
        .update(events)
        .set({
          ...data,
          agenda: JSON.stringify(agendaData),
          featured: featuredValue,
        })
        .where(eq(events.id, Number(id)));

      const poster = req.files?.img?.[0];
      const speaker = req.files?.speakerImg?.[0];

      if (poster) {
        const oldPoster = await tx.query.eventMedia.findFirst({
          where: (media, { and, eq }) =>
            and(
              eq(media.event_id, Number(id)),
              eq(media.mediaType, "event_poster")
            ),
        });

        if (oldPoster) {
          const filePath = path.join(
            process.cwd(),
            oldPoster.mediaUrl.replace(/^\/+/, "")
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          await tx
            .delete(eventMedia)
            .where(eq(eventMedia.id, oldPoster.id));
        }

        await tx.insert(eventMedia).values({
          event_id: Number(id),
          mediaUrl: `/uploads/${poster.filename}`,
          mediaType: "event_poster",
        });
      }

      if (speaker) {
        const oldSpeaker = await tx.query.eventMedia.findFirst({
          where: (media, { and, eq }) =>
            and(
              eq(media.event_id, Number(id)),
              eq(media.mediaType, "speaker_image")
            ),
        });

        if (oldSpeaker) {
          const filePath = path.join(
            process.cwd(),
            oldSpeaker.mediaUrl.replace(/^\/+/, "")
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }

          await tx
            .delete(eventMedia)
            .where(eq(eventMedia.id, oldSpeaker.id));
        }

        await tx.insert(eventMedia).values({
          event_id: Number(id),
          mediaUrl: `/uploads/${speaker.filename}`,
          mediaType: "speaker_image",
        });
      }
    });

    const updatedEvent = await db.query.events.findFirst({
      where: eq(events.id, Number(id)),
      with: {
        media: true,
      },
    });

    res.status(200).json(parseEvent(updatedEvent));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "خطأ في تعديل الفعالية",
      error: error.message,
    });
  }
};
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        await db.transaction(async (tx) => {
            const mediaFiles = await tx.query.eventMedia.findMany({
                where: eq(eventMedia.event_id, eventId)
            });

            for (const item of mediaFiles) {
                const filePath = path.join(process.cwd(), item.mediaUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await tx.delete(eventMedia).where(eq(eventMedia.event_id, eventId));

            await tx.delete(events).where(eq(events.id, eventId));
        });

        res.status(200).json({ message: "تم حذف الفعالية وكل صورها بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "خطأ أثناء الحذف", error: error.message });
    }
};
export const getRealStats = async (req, res) => {
    try {
       
        const [eventsCount, registrationsCount, usersCount] = await Promise.all([
            db.select({ count: sql`count(*) `}).from(events),
            db.select({ count: sql`count(*)` }).from(registrations),
            db.select({ count: sql`count(*)` }).from(users)
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalEvents: eventsCount[0].count,
                totalBeneficiaries: registrationsCount[0].count, 
                activeMembers: usersCount[0].count,
                volunteerHours: 640
}
        });
        
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب الإحصائيات", error: error.message });
    }
}
    
export const getGoals = async (req, res) => {
    try {
        const allGoals = await db.query.goals.findMany();
        
        res.status(200).json(allGoals);
    } catch (error) {
        res.status(500).json({ message: "خطأ في جلب الأهداف", error: error.message });
    }
};    

