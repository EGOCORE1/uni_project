import { db } from './src/db.js';
import { events } from './src/models/event.js';

const upcomingEvents = [
  {
    title: "متطلبات سوق العمل من المبرمجين",
    speaker: "أسامة دعبوس",
    speakerTitle: "مطور برمجيات ومدرب تقني",
    speakerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    date: "27 أكتوبر 2026",
    time: "10:00 AM",
    duration: "3 ساعات",
    location: "أونلاين / Zoom",
    attendees: 120,
    status: "upcoming",
    featured: true,
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    description: "في هذه الجلسة التفاعلية سنستعرض معاً أبرز التغييرات في سوق العمل التقني، وما يبحث عنه أصحاب العمل في المبرمجين الجدد.",
    agenda: JSON.stringify([
      "متطلبات سوق العمل التقني الحديث",
      "أهم لغات البرمجة والأطر المطلوبة (Laravel, React, Python)",
      "كيف تبني ملفك الشخصي التقني (GitHub & Portfolio)",
      "نماذج من مقابلات العمل التقنية",
      "أسرار العمل الحر وكيفية الحصول على أول عميل",
      "المهارات الناعمة التي يبحث عنها أصحاب العمل"
    ])
  },
  {
    title: "Up and Running with Laravel",
    speaker: "محمد صالح حسن",
    speakerTitle: "مطور Laravel محترف",
    speakerImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80",
    date: "27 أكتوبر 2026",
    time: "7:00 AM",
    duration: "3 ساعات",
    location: "كلية الهندسة",
    attendees: 60,
    status: "upcoming",
    featured: false,
    img: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
    description: "ورشة تطبيقية شاملة على إطار عمل Laravel، من الأساسيات حتى بناء تطبيق كامل.",
    agenda: JSON.stringify([
      "مقدمة إلى Laravel",
      "Routing & Controllers",
      "Eloquent ORM",
      "Blade Templates",
      "Authentication",
      "Deployment"
    ])
  },
  {
    title: "Technical Conversational Training",
    speaker: "أحمد الزعبي",
    speakerTitle: "مدرب لغوي تقني",
    speakerImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    date: "15 نوفمبر 2026",
    time: "11:00 AM",
    duration: "2 ساعة",
    location: "قاعة D2",
    attendees: 80,
    status: "upcoming",
    featured: false,
    img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
    description: "تدريب على المحادثة التقنية باللغة الإنجليزية لمواجهة مقابلات العمل الدولية.",
    agenda: JSON.stringify([
      "مفردات تقنية أساسية",
      "محادثات نموذجية",
      "تمارين جماعية",
      "تقييم مستوى اللغة"
    ])
  },
  {
    title: "SKILL UP GA — رفع مستوى المهارات",
    speaker: "لجنة الهيئة الطلابية",
    speakerTitle: "الهيئة الطلابية",
    speakerImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    date: "20 نوفمبر 2026",
    time: "9:00 AM",
    duration: "4 ساعات",
    location: "مدرج الكلية الكبير",
    attendees: 200,
    status: "upcoming",
    featured: false,
    img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    description: "يوم كامل من التدريبات والورشات المتنوعة لرفع مستوى طلاب الكلية.",
    agenda: JSON.stringify(["ورشة تصميم UX", "ورشة Python", "مسابقة برمجية", "حفل ختامي"])
  }
];
const archiveEvents = [
  {
    title: "Up and Running with Laravel — النسخة الأولى",
    date: "أكتوبر 2025",
    img: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?w=400&q=70",
    status: "archived" // تم ضبط الحالة إلى مؤرشف
  },
  {
    title: "Technical Conversational Training #1",
    date: "سبتمبر 2025",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=70",
    status: "archived"
  },
  {
    title: "أفضل ممارسة سيبرانية",
    date: "أغسطس 2025",
    img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=70",
    status: "archived"
  },
  {
    title: "متطلبات سوق العمل — النسخة الأولى",
    date: "يوليو 2025",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=70",
    status: "archived"
  },
  {
    title: "SKILL UP GA أول نسخة",
    date: "يونيو 2025",
    img: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=400&q=70",
    status: "archived"
  },
  {
    title: "Cybersecurity Workshop",
    date: "مايو 2025",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=70",
    status: "archived"
  }
];

async function seed() {
  try {
    await db.insert(events).values(upcomingEvents);
    console.log("تم إضافة جميع الفعاليات بنجاح إلى sqlite.db!");
  } catch (error) {
    console.error("حدث خطأ أثناء الإدخال:", error);
  }
}

seed();