const eventSchema = require('../models/eventSchema')

const mongoose = require('mongoose')
const { validationResult } = require("express-validator");

const createEvent = async (req, res) => {
    try {

        const { title, location, description, eventDate, capacity, createdBy, registeredCount, status } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty)
            return res.status(403).json({
                message: "Please provide all required fields"
            })

        const event = await eventSchema.create({
            title,
            location,
            description,
            eventDate,
            capacity,
            createdBy: req.user.id,
            registeredCount,
            status,
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        })

    } catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}


const getAllEvents = async (req, res) => {
    try {
        const event = await eventSchema.find({})
        if (event)
            res.status(200).json({ event })
    } catch (error) {
        res.status(403).json({ msg: error.message })
    }
}

const getSingleEvent = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        const event = await eventSchema.findById(id)
            .populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event fetched successfully",
            data: event
        });

    } catch (error) {

        console.error("Get Single Event Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });

    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getSingleEvent
}
