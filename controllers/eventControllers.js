import { db } from '../src/db.js'; 
import { events } from '../src/models/event.js'; 
import { eq , desc , sql } from 'drizzle-orm';
import { validationResult } from 'express-validator';
import {users} from '../src/models/user.js'
import { registrations } from '../src/models/registration.js';

export const createEvent = async (req, res) => {
  try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, location, description, event_date,event_time,lecturer_name,lecturer_title,session_axes, maxCapacity } = req.body;

        if (!title || !location || !event_date || !maxCapacity) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newEvent = await db.insert(events).values({
              title,
              description,
              location,
              event_date,
              event_time,
              lecturer_name,
              lecturer_title,
              session_axes,
              maxCapacity,
              organizerId: req.user.id 
        }).returning();

        res.status(201).json({
            message: "Event created successfully",
            event: newEvent[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const allEvents = await db.query.events.findMany({
            orderBy : (events , {desc})=>[desc(events.event_date)]
        });
        res.status(200).json({ events: allEvents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSingleEvent = async (req, res) => {
      try {
          const { id } = req.params;

          const event = await db.query.events.findFirst({
              where: (events, { eq }) => eq(events.id, Number(id)),
              with:{media : true} 
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ data: event });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }

};
export const getLatestEvents = async (req, res) => {
    try {
        const latest = await db.query.events.findMany({
            limit: 3,
            orderBy: (events, { desc }) => [desc(events.date)]
        });
        res.status(200).json({ events: latest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {  title, location, description, event_date,event_time,lecturer_name,lecturer_title,session_axes, maxCapacity } = req.body;

        const event = await db.query.events.findFirst({
            where: (events, { eq }) => eq(events.id, Number(id))
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const updatedEvent = await db.update(events)
            .set({
               title: title ?? event.title,
        description: description ?? event.description,
        location: location ?? event.location,
        event_date: event_date ?? event.event_date,
        event_time: event_time ?? event.event_time, 
        lecturer_name: lecturer_name ?? event.lecturer_name, 
        lecturer_title: lecturer_title ?? event.lecturer_title, 
        session_axes: session_axes ?? event.session_axes, 
        maxCapacity: maxCapacity ?? event.maxCapacity
            })
            .where(eq(events.id, Number(id)))
            .returning();

        res.status(200).json({
            message: "Event updated successfully",
            data: updatedEvent[0]
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
     try {
        const { id } = req.params;

        const event = await db.query.events.findFirst({
            where: (events, { eq }) => eq(events.id, Number(id))
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to delete this event" });
        }

        await db.delete(events).where(eq(events.id, Number(id)));

        res.status(200).json({ message: "Event deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getRealStats = async (req, res) => {
    try {
        const eventsResult = await db.select({ count: sql`count(*)` }).from(events);
        const beneficiariesResult = await db.select({ count: sql`count(*)` }).from(registrations);
        const activeMembersCount = await db.select({ count: sql`count(*)` }).from(users);

        res.status(200).json({
            success: true,
            data: {
                totalEvents: eventsResult[0].count,
                totalBeneficiaries: beneficiariesResult[0].count,
                activeMembers : activeMembersCount[0].count,

                volunteerHours: 640
            
            }
        });
    } catch (error) {
        res.status(500).json({ message: "خطأ في حساب الإحصائيات", error: error.message });
    }
};