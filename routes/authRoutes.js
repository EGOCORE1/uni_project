const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userAuth');
const authMiddleware = require('../middlewares/authmiddlewares')
const roleMiddleware = require('../middlewares/rolemiddlewares')
const {validateCreateEvent} = require('../validators/eventValidator')
const {createEvent , getAllEvents , getSingleEvent} = require('../controllers/eventControllers')

router.post("/register",registerUser);
router.post("/login" , loginUser);

// event action 

router.post("/createEvent" , validateCreateEvent ,authMiddleware , roleMiddleware("admin") , createEvent)
router.get("/getAllEvents" , authMiddleware , getAllEvents) 
router.get("/:id" , authMiddleware , getSingleEvent) 

module.exports = router;