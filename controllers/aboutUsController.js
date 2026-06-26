import { db } from "../src/db.js";
import { AboutUs } from "../src/models/aboutUs.js";
import { and, eq } from "drizzle-orm";

// StudentBody : طلاب الهيئة 
const creatStudentBody = async (req , res ) => {
    try {
        const {name , description , position} = req.body;
        const newStudent = await db.insert(AboutUs).values({
            name ,
            description,
            position
        }).returning();
        res.status(201).json({data : newStudent[0]})
    } catch (error) {
        res.status(500).json({error : `failed to Post Student`})
    }
}

const getStudentBody = async(req , res) => {
    try {
        const allStudentBody = await db.select().from(AboutUs)
    res.json({data : allStudentBody})
    } catch (error) {
    res.status(500).json({error : 'failed to fetch students'})
    }
};

const updateStudentBody = async (req , res ) => {
    try {
        const {name , description , position } = req.body;
        const id = Number(req.parms.id);

        const updatestudent = await db
        .update(AboutUs)
        .set({
            name,
            position,
            description,
            updatedAt : new Date().toISOString(),
        })
        .where(eq(AboutUs.id , id))
        .returning()
    
    if (!updatestudent.length){
        return res.status(404).json({error : 'student not found'})
    }
    }catch(error){
        res.status(500).json({error : 'failed to update student'});
    }
}


