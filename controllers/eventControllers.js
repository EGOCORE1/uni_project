import { db } from '../src/db.js';
import { events } from '../src/models/event.js';
import { registrations } from '../src/models/registration.js';
import { users } from '../src/models/user.js';
import { eq, desc, sql } from 'drizzle-orm';
const parseEvent = (event) => {
    // إذا كان الـ event نفسه غير معرف، أرجعي كائناً فارغاً لتجنب الانهيار
    if (!event) return {}; 
    
    // التأكد من أن event.media موجودة ومصفوفة
    const mediaList = event.media || []; 
    console.log("m",event.id,":", JSON.stringify(mediaList , null,2))
    return {
        ...event,
        event_id: event.id,
        agenda: event.agenda ? JSON.parse(event.agenda) : [],
        featured: event.featured === 1,
        img: mediaList.find(m => m.mediaType === "event_poster")?.mediaUrl || null,
        speakerImg: mediaList.find(m => m.mediaType === "speaker_image")?.mediaUrl || null,
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
        const { agenda, featured, ...data } = req.body;
        
        const updated = await db.update(events)
            .set({
                ...data,
                agenda: JSON.stringify(agenda),
                featured: featured ? 1 : 0
            })
            .where(eq(events.id, Number(id)))
            .returning();

        if (!updated.length) return res.status(404).json({ message: "Event not found" });
        
        res.status(200).json(parseEvent(updated[0]));
    } catch (error) {
        res.status(500).json({ message: "Error updating event", error: error.message });
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
};
