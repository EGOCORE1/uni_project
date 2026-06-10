import { db } from "../src/db.js";
import { registrations } from "../src/models/registration.js";
import { events } from '../src/models/event.js';
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
        const event = await db.query.events.findFirst({
            where : eq(events.id , targetEventId)});
        if(!event){
            return res.status(404).json({message:"الفعالية غير موجودة"})
        }    
        const today = new Date().toISOString().split('T')[0];
        if (event.date < today){          
              return res.status(400).json({ message: "عذراً، الفعالية منتهية ولا يمكن التسجيل" });
}
       if (event.current_attendees >= event.attendees) {
            return res.status(400).json({ message: "عذراً، الفعالية ممتلئة ولا يمكن التسجيل" });
        }

        const existingRegistration = await db.query.registrations.findFirst({
            where: and(eq(registrations.userId, userId), eq(registrations.eventId, targetEventId))
        });

        if (existingRegistration) {
            return res.status(400).json({ message: "أنت مسجل بالفعل في هذه الفعالية" });
        }
    await db.transaction(async (tx) => {
            
            await tx.insert(registrations).values({
                eventId: targetEventId,
                userId: userId,
                full_name,
                email,
                phone_number,
            });

            
            await tx.update(events)
                .set({ current_attendees: (event.current_attendees || 0) + 1 })
                .where(eq(events.id, targetEventId));
        });

        res.status(201).json({ message: "تم تسجيلك في الفعالية بنجاح!" });

    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء التسجيل", error: error.message });
    }}
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
await db.transaction(async (tx) => {
            await tx.delete(registrations).where(
                and(eq(registrations.userId, userId), eq(registrations.eventId, targetEventId))
            );

            const event = await tx.query.events.findFirst({
                where: eq(events.id, targetEventId)
            });

            if (event && event.current_attendees > 0) {
                await tx.update(events)
                    .set({ current_attendees: event.current_attendees - 1 })
                    .where(eq(events.id, targetEventId));
            }
        });

        res.status(200).json({ success: true, message: "تم إلغاء التسجيل بنجاح وتم تحديث عدد المشاركين" });
        
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إلغاء التسجيل", error: error.message})}}
export const checkRegistrationStatus = async (req, res) => {
    try {
        const { event_id } = req.params;
        const userId = req.user.id;
        const targetEventId = Number(event_id);
        const event = await db.query.events.findFirst({
            where : eq(events.id , targetEventId)
         
        })
        const today = new Date().toISOString().split('T')[0];
        const isExpired = event.date < today ;

    const registration = await db.query.registrations.findFirst({
            where: and(eq(registrations.userId, userId), eq(registrations.eventId, Number(event_id)))
        });
    if(!event){
        return res.status(404).json({message:"الفعالية غير موجودة"})
    }

        res.status(200).json({ isRegistered: !!registration,
            isFull : event.current_attendees >= event.attendees,
            remainingSeats : event.attendees - event.current_attendees,
            isExpired : isExpired
         });
    } catch (error) {
        res.status(500).json({ message: "خطأ في التحقق من الحالة", error: error.message });
    }
};