import { body } from 'express-validator';

export const validateCreateEvent = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .optional() 
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("maxCapacity") 
    .isInt({ min: 1, max: 1000 })
    .withMessage("Capacity must be between 1 and 1000"),

  body("date") 
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format (YYYY-MM-DD)"),

];