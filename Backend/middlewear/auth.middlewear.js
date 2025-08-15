import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = { id: data.id, email: data.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
