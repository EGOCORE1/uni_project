import { db } from '../src/db.js';
import { events } from '../src/models/event.js';
import { registrations } from '../src/models/registration.js';
import { users } from '../src/models/user.js';
import { eq, desc, sql } from 'drizzle-orm';
import { goals }from '../src/models/goal.js'
const parseEvent = (event) => {
    return {
        ...event,
        event_id: event.id,
        agenda: event.agenda ? JSON.parse(event.agenda) : [],
        featured: event.featured === 1,
        img: event.media.find(m => m.mediaType === "event_poster")?.mediaUrl || null,
        speakerImg: event.media.find(m => m.mediaType === "speaker_image")?.mediaUrl || null,
    };
};

export const createEvent = async (req, res) => {
    try {
        const { agenda, featured, ...data } = req.body;
        const newEvent = await db.insert(events).values({
            ...data,
            agenda: JSON.stringify(agenda),
            featured: featured ? 1 : 0,
            organizerId: req.user.id
        }).returning();
        
        res.status(201).json(parseEvent(newEvent[0]));
    } catch (error) {
        res.status(500).json({ message: "Error creating event", error: error.message });
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
        
        const body = req.body; 
        let agendaData = body.agenda;
        if (typeof agendaData === 'string') {
            try {
                agendaData = JSON.parse(agendaData);
            } catch (e) {
            }
        }

        let featuredValue = body.featured;
        if (featuredValue !== undefined) {
            featuredValue = (featuredValue === 'true' || featuredValue === true || featuredValue === 1) ? 1 : 0;
        }

        const { agenda, featured, ...data } = body;

        const updatedEvent = await db.transaction(async (tx) => {
            await tx.update(events)
                .set({
                    ...data,
                    agenda: agendaData ? JSON.stringify(agendaData) : undefined,
                    featured: featuredValue !== undefined ? featuredValue : undefined
                })
                .where(eq(events.id, Number(id)));

            return await tx.query.events.findFirst({
                where: eq(events.id, Number(id))
            });
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: "الفعالية غير موجودة" });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "خطأ في التحديث", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await db.delete(events).where(eq(events.id, Number(req.params.id)));
        res.status(200).json({ message: "Event deleted successfully" });
        } catch (error) {
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
;}
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

