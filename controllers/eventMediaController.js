import { db } from "../src/db.js";
import { eventMedia } from "../src/models/eventMedia.js";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("الرجاء رفع ملفات صور فقط!"), false);
    }
};

export const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const addEventMedia = async (req, res) => {
    try {
        const { event_Id } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "الرجاء اختيار صورة لرفعها" });
        }

        if (!event_Id) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "الرجاء تحديد معرّف الفعالية eventId" });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        const newMedia = await db.insert(eventMedia).values({
            eventId: Number(event_Id),
            mediaUrl: fileUrl,
            mediaType: "image"
        }).returning();

        res.status(201).json({
            message: "تم رفع وحفظ الصورة محلياً بنجاح",
            media: newMedia[0]
        });

    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "حدث خطأ أثناء معالجة رفع الصورة", error: error.message });
    }
};

export const getEventMedia = async (req, res) => {
    const { event_Id } = req.params;
    try {
        const media = await db.query.eventMedia.findMany({
            where: (eventMedia, { eq }) => eq(eventMedia.eventId, Number(event_Id))
        });
        res.status(200).json({ media });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteEventMedia = async (req, res) => {
    const { id } = req.params;
    try {
        const mediaItem = await db.query.eventMedia.findFirst({
            where: (eventMedia, { eq }) => eq(eventMedia.id, Number(id))
        });

        if (!mediaItem) {
            return res.status(404).json({ message: "الصورة غير موجودة في قاعدة البيانات" });
        }

        const filePath = path.join(process.cwd(), mediaItem.mediaUrl);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await db.delete(eventMedia).where(eq(eventMedia.id, Number(id)));

        res.status(200).json({ message: "تم حذف الصورة من السيرفر وقاعدة البيانات بنجاح" });

    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء عملية الحذف", error: error.message });
    }
};