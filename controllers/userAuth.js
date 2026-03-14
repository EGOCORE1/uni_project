const userSchema = require('../models/userSchema')
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {

    const { name, email, password, role } = req.body;
    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }

        const foundedEmail = await userSchema.findOne({ email })

        if (foundedEmail)
            return res.status(400).json({ msg: `sorry .. try latter` });

        const user = await userSchema.create({
            name,
            password,
            email,
            role
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
            });
        }

        const user = await userSchema.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        console.log(" 1 _User before token:", user);

        const token = generateToken(user);

        console.log(" 2 _ Generated token:", token);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error ..",
            error: error.message
        });

    }

};

module.exports = { registerUser, loginUser };