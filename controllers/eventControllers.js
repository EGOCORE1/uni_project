import { db } from '../src/db.js'; 
import { events } from '../src/models/event.js'; 
import { eq } from 'drizzle-orm';
import { validationResult } from 'express-validator';

export const createEvent = async (req, res) => {
  try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, location, description, date, maxCapacity } = req.body;

        if (!title || !location || !date || !maxCapacity) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const newEvent = await db.insert(events).values({
              title,
              description,
              location,
              date,
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
        const allEvents = await db.query.events.findMany();
        res.status(200).json({ events: allEvents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSingleEvent = async (req, res) => {
      try {
          const { id } = req.params;

          const event = await db.query.events.findFirst({
              where: (events, { eq }) => eq(events.id, Number(id))
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ data: event });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, date, maxCapacity } = req.body;

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
                date: date ?? event.date,
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