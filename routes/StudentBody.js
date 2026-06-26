import express from 'express'
import {creatStudentBody,
         getStudentBody , 
         updateStudentBody} from '../controllers/aboutUsController.js'
import router from './eventAuth.js'

router.get('/studentBody' , getStudentBody)
router.post('/studentBody' , creatStudentBody)
router.put('/studentBody/:id' , updateStudentBody)

export default router