import { db } from "../src/db.js";
import { AboutUs } from "../src/models/aboutUs.js";
import { eq } from "drizzle-orm";

// إضافة طالب/عضو جديد
export const creatStudentBody = async (req, res) => {
    try {
        const { name, description, position } = req.body;
        
        // استخدام run() لأن SQLite لا تدعم returning()
        await db.insert(AboutUs).values({
            name,
            description,
            position
        }).run();

        // جلب آخر سجل تم إضافته للتأكد
        const newStudent = await db.query.AboutUs.findFirst({
            orderBy: (about, { desc }) => [desc(about.id)]
        });

        res.status(201).json({ data: newStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to Post Student" });
    }
};

// جلب جميع أعضاء الهيئة
export const getStudentBody = async (req, res) => {
    try {
        const allStudentBody = await db.select().from(AboutUs);
        res.json({ data: allStudentBody });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed to fetch students' });
    }
};

// تحديث بيانات عضو
export const updateStudentBody = async (req, res) => {
    try {
        const { name, description, position } = req.body;
        const id = Number(req.params.id); // تصحيح الخطأ الإملائي هنا

        // تنفيذ التحديث
        await db.update(AboutUs)
            .set({
                name,
                position,
                description,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(AboutUs.id, id))
            .run();

        // جلب البيانات بعد التحديث للتأكد
        const updatedStudent = await db.query.AboutUs.findFirst({
            where: eq(AboutUs.id, id)
        });

        if (!updatedStudent) {
            return res.status(404).json({ error: 'student not found' });
        }

        res.status(200).json({ data: updatedStudent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'failed to update student' });
    }
};