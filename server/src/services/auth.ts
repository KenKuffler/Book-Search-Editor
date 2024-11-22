import jwt from 'jsonwebtoken';

export const signToken = (username: string, email: string, _id: unknown): string => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not set in environment variables.');
  }

  try {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
  } catch (err) {
    console.error('Error signing token:', err);
    throw new Error('Failed to generate token.');
  }
};

export const verifyToken = (token: string) => {
  const secretKey = process.env.JWT_SECRET_KEY || '';
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    console.error('Token verification failed:', err);
    throw new Error('Invalid or expired token');
  }
};
