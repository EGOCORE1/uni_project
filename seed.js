import { db } from './src/db.js';
import { events } from './src/models/event.js';
import { eventMedia } from './src/models/eventMedia.js';

async function seed() {
    console.log("جاري البدء بعملية إدخال البيانات...");

    const allEvents = [
        { title: "متطلبات سوق العمل من المبرمجين", speaker: "أسامة دعبوس", date: "2026-10-27", featured: 1, agenda: JSON.stringify(["متطلبات السوق", "لغات البرمجة", "بناء الملف التقني"]), description: "استعراض لتغييرات سوق العمل التقني." }, 
        { title: "Up and Running with Laravel", speaker: "محمد صالح حسن", date: "2026-10-27", featured: 0, agenda: JSON.stringify(["مقدمة إلى Laravel", "Routing & Controllers"]), description: "ورشة شاملة على إطار عمل Laravel." },
        { title: "Technical Conversational Training", speaker: "أحمد الزعبي", date: "2026-11-15", featured: 0, agenda: JSON.stringify(["مفردات تقنية", "محادثات نموذجية"]), description: "تدريب على المحادثة التقنية." },
        { title: "SKILL UP GA — رفع مستوى المهارات", speaker: "لجنة الهيئة الطلابية", date: "2026-11-20", featured: 0, agenda: JSON.stringify(["ورشة UX", "ورشة Python"]), description: "يوم تدريبي لرفع مستوى الطلاب." },
        { title: "Up and Running with Laravel — النسخة الأولى", date: "2025-10-01", description: "أرشيف" },
        { title: "Technical Conversational Training #1", date: "2025-09-01", description: "أرشيف" },
        { title: "أفضل ممارسة سيبرانية", date: "2025-08-01", description: "أرشيف" },
        { title: "متطلبات سوق العمل — النسخة الأولى", date: "2025-07-01", description: "أرشيف" },
        { title: "SKILL UP GA أول نسخة", date: "2025-06-01", description: "أرشيف" },
        { title: "CYbersecurity Workshop", date: "2025-05-15", description: "أرشيف" }
    ];

    const createdEvents = await db.insert(events).values(allEvents).returning();

    const mediaMap = [
        { id: createdEvents[0].id, imgs: [{url: "/uploads/event11.jpg", type: "event_poster"}, {url: "/uploads/event1.jpg", type: "speaker_image"}] },
        { id: createdEvents[1].id, imgs: [{url: "/uploads/event22.jpg", type: "event_poster"}, {url: "/uploads/event2.jpg", type: "speaker_image"}] },
        { id: createdEvents[2].id, imgs: [{url: "/uploads/event33.jpg", type: "event_poster"}, {url: "/uploads/event3.jpg", type: "speaker_image"}] },
        { id: createdEvents[3].id, imgs: [{url: "/uploads/event44.jpg", type: "event_poster"}, {url: "/uploads/event4.jpg", type: "speaker_image"}] },
        { id: createdEvents[4].id, imgs: [{url: "/uploads/event5.jpg", type: "event_poster"}] },
        { id: createdEvents[5].id, imgs: [{url: "/uploads/event6.jpg", type: "event_poster"}] },
        { id: createdEvents[6].id, imgs: [{url: "/uploads/event7.jpg", type: "event_poster"}] },
        { id: createdEvents[7].id, imgs: [{url: "/uploads/event8.jpg", type: "event_poster"}] },
        { id: createdEvents[8].id, imgs: [{url: "/uploads/event9.jpg", type: "event_poster"}] },
        { id: createdEvents[9].id, imgs: [{url: "/uploads/event10.jpg", type: "event_poster"}] }
    ];

    for (const item of mediaMap) {
        for (const img of item.imgs) {
            await db.insert(eventMedia).values({
                event_id: item.id,
                mediaUrl: img.url,
                mediaType: img.type
            });
        }
    }

    console.log("تمت إضافة جميع الفعاليات مع صورها بنجاح! 🎉");
    process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });