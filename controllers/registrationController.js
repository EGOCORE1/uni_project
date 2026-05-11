import { db } from "../src/db.js";
import { registrations } from "../src/models/registration.js";
import { eq } from "drizzle-orm";

export const registerToEvent = async (req, res) => {
    try {
        const { eventId, full_name, email, phone_number } = req.body;

        const newRegistration = await db.insert(registrations).values({
            eventId,
            full_name,
            email,
            phone_number,
        }).returning();

        res.status(201).json({
            message: "تم التسجيل في الفعالية بنجاح!",
            data: newRegistration[0]
        });

    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء التسجيل", error: error.message });
    }
};