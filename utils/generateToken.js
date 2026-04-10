import jwt from 'jsonwebtoken';

const generateToken = (user) => {
   const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET || 'MY_SECRET_KEY',
    {
      expiresIn: "1d"
    }
  );
  return token;
};

export default generateToken;