const userSchema = require('../models/userSchema')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const foundedEmail = await userSchema.findOne({ email })
    if (foundedEmail)
        return res.status(400).json({ msg: `User already exists` });
    const user = await userSchema.create({ name, password, email });
    res.status(201).json({
        _id: user.id,
        name: user.id,
        email: user.email,
        token: generateToken(user.id)
    })

}
module.exports = { registerUser }