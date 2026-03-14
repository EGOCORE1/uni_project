const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userAuth');
const authMiddleware = require('../middlewares/authmiddlewares')
const roleMiddleware = require('../middlewares/rolemiddlewares')

router.post("/register",registerUser);
router.post("/login" , loginUser);
router.post("/Admin", authMiddleware ,roleMiddleware("admin") ,loginUser);
router.post("/User", authMiddleware ,roleMiddleware("user") ,loginUser);

module.exports = router;