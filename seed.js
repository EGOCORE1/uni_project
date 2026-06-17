import { db } from './src/db.js';
import { events } from './src/models/event.js';

async function seed() {
    console.log("جاري البدء بعملية إدخال البيانات الحقيقية...");

    const allEvents = [
        // --- الفعاليات القادمة ---
        { title: "متطلبات سوق العمل من المبرمجين", speaker: "أسامة دعبوس", date: "2026-10-27", time: "10:00", duration: "3 ساعات", location: "أونلاين / Zoom", attendees: 120, current_attendees: 0, featured: 1, agenda: JSON.stringify(["متطلبات السوق", "لغات البرمجة", "بناء الملف التقني"]), description: "استعراض لتغييرات سوق العمل التقني." },
        { title: "Up and Running with Laravel", speaker: "محمد صالح حسن", date: "2026-10-27", time: "07:00", duration: "3 ساعات", location: "كلية الهندسة", attendees: 60, current_attendees: 0, featured: 0, agenda: JSON.stringify(["مقدمة إلى Laravel", "Routing & Controllers"]), description: "ورشة شاملة على إطار عمل Laravel." },
        { title: "Technical Conversational Training", speaker: "أحمد الزعبي", date: "2026-11-15", time: "11:00", duration: "2 ساعة", location: "قاعة D2", attendees: 80, current_attendees: 0, featured: 0, agenda: JSON.stringify(["مفردات تقنية", "محادثات نموذجية"]), description: "تدريب على المحادثة التقنية." },
        { title: "SKILL UP GA — رفع مستوى المهارات", speaker: "لجنة الهيئة الطلابية", date: "2026-11-20", time: "09:00", duration: "4 ساعات", location: "مدرج الكلية", attendees: 200, current_attendees: 0, featured: 0, agenda: JSON.stringify(["ورشة UX", "ورشة Python"]), description: "يوم تدريبي لرفع مستوى الطلاب." },

        // --- الفعاليات الأرشيفية (المنتهية) ---
        { title: "Up and Running with Laravel — النسخة الأولى", date: "2025-10-01", attendees: 60, current_attendees: 60, agenda: JSON.stringify([]), description: "أرشيف" },
        { title: "Technical Conversational Training #1", date: "2025-09-01", attendees: 80, current_attendees: 80, agenda: JSON.stringify([]), description: "أرشيف" },
        { title: "أفضل ممارسة سيبرانية", date: "2025-08-01", attendees: 50, current_attendees: 50, agenda: JSON.stringify([]), description: "أرشيف" },
        { title: "متطلبات سوق العمل — النسخة الأولى", date: "2025-07-01", attendees: 100, current_attendees: 100, agenda: JSON.stringify([]), description: "أرشيف" },
        { title: "SKILL UP GA أول نسخة", date: "2025-06-01", attendees: 200, current_attendees: 200, agenda: JSON.stringify([]), description: "أرشيف" }
    ];

    await db.insert(events).values(allEvents);
    console.log("تمت إضافة كافة الفعاليات بنجاح! 🎉");
    process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });