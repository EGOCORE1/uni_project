import { db } from "../src/db.js";
import { registrations } from "../src/models/registration.js";
import { and, eq } from "drizzle-orm";

export const registerToEvent = async (req, res) => {
    try {
        const { event_id, full_name, email, phone_number } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "غير مصرح لك، يرجى تسجيل الدخول أولاً" });
        }

        if (!event_id || !full_name || !email || !phone_number) {
            return res.status(400).json({ message: "الرجاء إدخال جميع الحقول المطلوبة" });
        }

        const userId = req.user.id;
        const targetEventId = Number(event_id);

        const existingRegistration = await db.query.registrations.findFirst({
            where: and(eq(registrations.userId, userId), eq(registrations.eventId, targetEventId))
        });

        if (existingRegistration) {
            return res.status(400).json({ message: "أنت مسجل بالفعل في هذه الفعالية" });
        }

        const newRegistration = await db.insert(registrations).values({
            eventId: targetEventId, 
            userId: userId, 
            full_name,
            email,
            phone_number,
        }).returning();

        res.status(201).json({
            message: "تم تسجيلك في الفعالية بنجاح!",
            data: newRegistration[0]
        });

    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء التسجيل", error: error.message });
    }
};

// 2. إلغاء التسجيل
export const cancelRegistration = async (req, res) => {
    try {
        const { event_id } = req.body; 

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "غير مصرح لك" });
        }

        const userId = req.user.id;
        const targetEventId = Number(event_id);

        const existingRegistration = await db.query.registrations.findFirst({
            where: and(eq(registrations.userId, userId), eq(registrations.eventId, targetEventId))
        });

        if (!existingRegistration) {
            return res.status(404).json({ message: "لم يتم العثور على حجز لإلغائه" });
        }

        await db.delete(registrations).where(
            and(eq(registrations.userId, userId), eq(registrations.eventId, targetEventId))
        );

        res.status(200).json({ success: true, message: "تم إلغاء التسجيل بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إلغاء التسجيل", error: error.message });
    }
};

export const checkRegistrationStatus = async (req, res) => {
    try {
        const { event_id } = req.params;
        const userId = req.user.id;

        const registration = await db.query.registrations.findFirst({
            where: and(eq(registrations.userId, userId), eq(registrations.eventId, Number(event_id)))
        });

        res.status(200).json({ isRegistered: !!registration });
    } catch (error) {
        res.status(500).json({ message: "خطأ في التحقق من الحالة", error: error.message });
    }
};