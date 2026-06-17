import { db } from './src/db.js';
import { events } from './src/models/event.js';
import { eventMedia } from './src/models/eventMedia.js';

async function seed() {
    console.log("جاري البدء بعملية إدخال البيانات للفعاليات والأرشيف...");

    // 1. قائمة كاملة تشمل الفعاليات والأرشيف
    const allEvents = [
        // الفعاليات القادمة
        { title: "متطلبات سوق العمل من المبرمجين", speaker: "أسامة دعبوس", date: "2026-10-27", featured: 1, agenda: JSON.stringify(["متطلبات السوق", "لغات البرمجة", "بناء الملف التقني"]), description: "استعراض لتغييرات سوق العمل التقني." }, 
        { title: "Up and Running with Laravel", speaker: "محمد صالح حسن", date: "2026-10-27", featured: 0, agenda: JSON.stringify(["مقدمة إلى Laravel", "Routing & Controllers"]), description: "ورشة شاملة على إطار عمل Laravel." },
        { title: "Technical Conversational Training", speaker: "أحمد الزعبي", date: "2026-11-15", featured: 0, agenda: JSON.stringify(["مفردات تقنية", "محادثات نموذجية"]), description: "تدريب على المحادثة التقنية." },
        { title: "SKILL UP GA — رفع مستوى المهارات", speaker: "لجنة الهيئة الطلابية", date: "2026-11-20", featured: 0, agenda: JSON.stringify(["ورشة UX", "ورشة Python"]), description: "يوم تدريبي لرفع مستوى الطلاب." },
        // الأرشيف
        { title: "Up and Running with Laravel — النسخة الأولى", date: "2025-10-01", description: "أرشيف" },
        { title: "Technical Conversational Training #1", date: "2025-09-01", description: "أرشيف" },
        { title: "أفضل ممارسة سيبرانية", date: "2025-08-01", description: "أرشيف" },
        { title: "متطلبات سوق العمل — النسخة الأولى", date: "2025-07-01", description: "أرشيف" },
        { title: "SKILL UP GA أول نسخة", date: "2025-06-01", description: "أرشيف" },
        { title: "CYbersecurity Workshop", date: "2025-05-15", description: "أرشيف" }
    ];

    const createdEvents = await db.insert(events).values(allEvents).returning();

    // 2. ربط الصور لكل حدث (حسب ترتيب الإدخال)
    const mediaToInsert = [
        { event_id: createdEvents[0].id, mediaUrl: '/uploads/event11.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[0].id, mediaUrl: '/uploads/event1.jpg', mediaType: 'speaker_image' },
        { event_id: createdEvents[1].id, mediaUrl: '/uploads/event22.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[1].id, mediaUrl: '/uploads/event2.jpg', mediaType: 'speaker_image' },
        { event_id: createdEvents[2].id, mediaUrl: '/uploads/event33.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[2].id, mediaUrl: '/uploads/event3.jpg', mediaType: 'speaker_image' },
        { event_id: createdEvents[3].id, mediaUrl: '/uploads/event44.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[3].id, mediaUrl: '/uploads/event4.jpg', mediaType: 'speaker_image' },
        { event_id: createdEvents[4].id, mediaUrl: '/uploads/event5.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[5].id, mediaUrl: '/uploads/event6.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[6].id, mediaUrl: '/uploads/event7.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[7].id, mediaUrl: '/uploads/event8.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[8].id, mediaUrl: '/uploads/event9.jpg', mediaType: 'event_poster' },
        { event_id: createdEvents[9].id, mediaUrl: '/uploads/event10.jpg', mediaType: 'event_poster' }
    ];

    await db.insert(eventMedia).values(mediaToInsert);

    console.log("تم إدخال كافة الفعاليات والأرشيف بنجاح! 🎉");
    process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });