import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET || 'MY_SECRET_KEY';
        
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

         next();
 } catch (error) {
     return res.status(401).json({ message: "Invalid token" });
}
};

export default authMiddleware;