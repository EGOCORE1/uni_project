import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../src/db.js'; 
import { users } from '../src/models/user.js'; 

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET  ||'MY_SECRET_KEY',
        { expiresIn: '1d' } 
    );
};

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const foundedEmail = await db.query.users.findFirst({ 
            where: (users, { eq }) => eq(users.email, email) 
        });

        if (foundedEmail) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const insertedUsers = await db.insert(users).values({
            fullName: name, 
            password: hashedpass,
            email,
            role: role || 'student'
        }).returning();

        const user = insertedUsers[0]; 
        res.status(201).json({
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};