import { db } from './src/db.js'; // تأكدي من المسار الصحيح لملف db.js
import { eventMedia } from './src/models/eventMedia.js';

async function checkData() {
    console.log("--- فحص جدول الوسائط ---");
    const media = await db.select().from(eventMedia);
    console.log(media);
    
    if (media.length === 0) {
        console.log("النتيجة: جدول الوسائط فارغ تماماً!");
    } else {
        console.log(`تم العثور على ${media.length} سجلات.`);
    }
}

checkData();