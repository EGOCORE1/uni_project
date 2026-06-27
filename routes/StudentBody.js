import express from 'express'

import {creatStudentBody,
         getStudentBody , 
         updateStudentBody} from '../controllers/aboutUsController.js'

const router = express.Router();

router.get('/student' , getStudentBody)
router.post('/studentBody' , creatStudentBody)
router.put('/studentBody/:id' , updateStudentBody)

export default router