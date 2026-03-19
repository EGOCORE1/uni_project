const { body } = require("express-validator");

const validateCreateEvent = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("capacity")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Capacity must be between 1 and 1000"),

  body("eventDate")
    .isISO8601()
    .withMessage("Invalid date format")
    .toDate(),

  body("status")
    .optional()
    .isIn(["upcoming", "cancelled", "completed"])
    .withMessage("Invalid event status")

];

module.exports = { validateCreateEvent };