import { db } from './src/db.js';
import { events } from './src/models/event.js';
import { eventMedia } from './src/models/eventMedia.js';
import { goals } from './src/models/goal.js';


async function seed() {
    const goalsData = [
    { 
        content: "تمثيل الطلاب أمام إدارة الكلية والعمل على حل المشكلات الأكاديمية والخدمية التي تواجههم خلال مسيرتهم الدراسية" 
    },
    { 
        content: "خلق بيئة تفاعلية من خلال الأنشطة الترفيهية والاجتماعية التي تكسر روتين الدراسة وتنمي مهارات العمل الجماعي" 
    },
    { 
        content: "توفير المصادر التعليمية والبحثية، وتسهيل تبادل الخبرات بين الطلاب من مختلف السنوات الدراسية" 
    }
];
    

    console.log("جاري البدء بعملية إدخال البيانات للفعاليات والأرشيف...");

    const allEvents = [
        { title: "متطلبات سوق العمل من المبرمجين", speaker: "أسامة دعبوس", date: "2026-10-27", featured: 1, agenda: JSON.stringify(["متطلبات السوق", "لغات البرمجة", "بناء الملف التقني"]), description: "استعراض لتغييرات سوق العمل التقني." ,time: "10:00", duration: "3 ساعات", location: "أونلاين / Zoom", attendees: 2, current_attendees: 0}, 
        { title: "Up and Running with Laravel", speaker: "محمد صالح حسن", date: "2026-10-27", featured: 0, agenda: JSON.stringify(["مقدمة إلى Laravel", "Routing & Controllers"]), description: "ورشة شاملة على إطار عمل Laravel.", time: "07:00", duration: "3 ساعات", location: "كلية الهندسة", attendees: 60, current_attendees: 0 },
        { title: "Technical Conversational Training", speaker: "أحمد الزعبي", date: "2026-11-15", featured: 0, agenda: JSON.stringify(["مفردات تقنية", "محادثات نموذجية"]), description: "تدريب على المحادثة التقنية." ,time: "11:00", duration: "2 ساعة", location: "قاعة D2", attendees: 80, current_attendees: 0},
        { title: "SKILL UP GA — رفع مستوى المهارات", speaker: "لجنة الهيئة الطلابية", date: "2026-11-20", featured: 0, agenda: JSON.stringify(["ورشة UX", "ورشة Python"]), description: "يوم تدريبي لرفع مستوى الطلاب.", time: "09:00", duration: "4 ساعات", location: "مدرج الكلية", attendees: 200, current_attendees: 0 },
        { title: "Up and Running with Laravel — النسخة الأولى", date: "2025-10-01", description: "أرشيف" },
        { title: "Technical Conversational Training #1", date: "2025-09-01", description: "أرشيف" },
        { title: "أفضل ممارسة سيبرانية", date: "2025-08-01", description: "أرشيف" },
        { title: "متطلبات سوق العمل — النسخة الأولى", date: "2025-07-01", description: "أرشيف" },
        { title: "SKILL UP GA أول نسخة", date: "2025-06-01", description: "أرشيف" },
        { title: "CYbersecurity Workshop", date: "2025-05-15", description: "أرشيف" }
    ];

    const createdEvents = await db.insert(events).values(allEvents).returning();

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