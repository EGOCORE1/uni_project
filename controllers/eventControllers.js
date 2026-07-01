import { db } from "../src/db.js";
import { events } from "../src/models/event.js";
import { registrations } from "../src/models/registration.js";
import { users } from "../src/models/user.js";
import { eq, desc, sql } from "drizzle-orm";
import { goals } from "../src/models/goal.js";
import { eventMedia } from "../src/models/eventMedia.js";
import path from "path";
import fs from "fs";
const parseEvent = (event) => {
  const mediaList = event.media  ||[];

  const cleanUrl = (url) => {
    if (!url) return null;
    const clean = url.replace(/([^:]\/)\/+/g, "$1").trim();
    return clean.startsWith("http")
      ? clean
      : ` http://localhost:4000/${clean.replace(/^\/+/, "")}`;
  };

  const poster = mediaList.find(
    (m) => m.mediaType === "image"||  m.mediaType === "event_poster",
  )?.mediaUrl;
  const speaker = mediaList.find(
    (m) => m.mediaType === "speaker_image",
  )?.mediaUrl;

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
    let agendaParsed = agenda;
    if (typeof agenda === "string") {
      try {
        agendaParsed = JSON.parse(agenda);
      } catch (err) {
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
    const result = await db
      .insert(events)
      .values({
        ...data,
        organizerId: data.organizerId ? Number(data.organizerId) : null,
        agenda: JSON.stringify(agendaParsed),
        featured: featuredValue,
      })
      .run();

    const newEvent = await db.query.events.findFirst({
      orderBy: (events, { desc }) => [desc(events.id)],
    });

    if (!newEvent) {
      return res.status(500).json({
        message: "فشل إنشاء الفعالية",
      });
    }

    if (req.files && req.files.length > 0) {
      const types = ["event_poster", "speaker_image"];
      for (let i = 0; i < req.files.length; i++) {
        await db.insert(eventMedia).values({
          event_id: newEvent.id,
          mediaUrl: `/uploads/${req.files[i].filename}`,
          mediaType: types[i] || "image",
        });
      }
    }

    return res.status(201).json({
      message: "تم إنشاء الفعالية بنجاح",
      event: newEvent,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "خطأ أثناء إنشاء الفعالية",
      error: error.message,
    });
  }
};
export const getActiveEvents = async (req, res) => {
  try {
    const active = await db.query.events.findMany({
      where: (events, { gt }) =>
        gt(events.date, new Date().toISOString().split("T")[0]),
      with: { media: true },
    });
    res.status(200).json(active.map(parseEvent));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArchiveEvents = async (req, res) => {
  try {
    const archive = await db.query.events.findMany({
      where: (events, { lte }) =>
        lte(events.date, new Date().toISOString().split("T")[0]),
      with: { media: true },
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
      with: { media: true },
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(parseEvent(event));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

export const getLatestEvents = async (req, res) => {
  try {
    const latest = await db.query.events.findMany({
      orderBy: desc(events.date),
      limit: 3,
      with: { media: true },
    });
    res.status(200).json(latest.map(parseEvent));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching latest events", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    let agendaData = body.agenda;

    if (typeof agendaData === "string") {
      try {
        agendaData = JSON.parse(agendaData);
      } catch (err) {}
    }

    let featuredValue = body.featured;

    if (featuredValue !== undefined) {
      featuredValue =
        featuredValue === "true" ||
        featuredValue === true ||
        featuredValue === 1 ||
        featuredValue === "1"
          ? 1
          : 0;
    }

    const { agenda, featured, ...data } = body;

    const updatedEvent = await db.transaction(async (tx) => {
      await tx
        .update(events)
        .set({
          ...data,
          agenda: agendaData ? JSON.stringify(agendaData) : null,
          featured: featuredValue,
        })
        .where(eq(events.id, Number(id)));

      if (req.files && req.files.length > 0) {
        const { hasNewPoster, hasNewSpeaker } = req.body;
        let fileIndex = 0; 

        
        if (hasNewPoster === "true" && req.files[fileIndex]) {
         
          const oldPoster = await tx.query.eventMedia.findFirst({
            where: (em, { and, eq }) =>
              and(
                eq(em.event_id, Number(id)),
                eq(em.mediaType, "event_poster"),
              ),
          });

          if (oldPoster) {
            const filePath = path.join(
              process.cwd(),
              oldPoster.mediaUrl.replace(/^\/+/, ""),
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
            await tx.delete(eventMedia).where(eq(eventMedia.id, oldPoster.id)); 
          }

          await tx.insert(eventMedia).values({
            event_id: Number(id),
            mediaUrl: `/uploads/${req.files[fileIndex].filename}`,
            mediaType: "event_poster",
          });

        
          fileIndex++;
        }

        if (hasNewSpeaker === "true" && req.files[fileIndex]) {
          const oldSpeaker = await tx.query.eventMedia.findFirst({
            where: (em, { and, eq }) =>
              and(
                eq(em.event_id, Number(id)),
                eq(em.mediaType, "speaker_image"),
              ),
          });

          if (oldSpeaker) {
            const filePath = path.join(
              process.cwd(),
              oldSpeaker.mediaUrl.replace(/^\/+/, ""),
            );
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            await tx.delete(eventMedia).where(eq(eventMedia.id, oldSpeaker.id)); 
          }

          await tx.insert(eventMedia).values({
            event_id: Number(id),
            mediaUrl: `/uploads/${req.files[fileIndex].filename}`,
            mediaType: "speaker_image",
          });
        }
      }
      return await tx.query.events.findFirst({
        where: eq(events.id, Number(id)),
        with: {
          media: true,
        },
      });
    });

    if (!updatedEvent) {
      return res.status(404).json({
        message: "الفعالية غير موجودة",
      });
    }

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Event Error:", error);

    return res.status(500).json({
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
        where: eq(eventMedia.event_id, eventId),
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
      db.select({ count: sql`count(*) ` }).from(events),
      db.select({ count: sql`count(*)` }).from(registrations),
      db.select({ count: sql`count(*)` }).from(users),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents: eventsCount[0].count,
        totalBeneficiaries: registrationsCount[0].count,
        activeMembers: usersCount[0].count,
        volunteerHours: 640,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res
      .status(500)
      .json({ message: "حدث خطأ أثناء جلب الإحصائيات", error: error.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const allGoals = await db.query.goals.findMany();

    res.status(200).json(allGoals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في جلب الأهداف", error: error.message });
  }
};