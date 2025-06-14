import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const users = {
  'user@example.com': { password: 'test123', tenant: 'tenant1' }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) return res.status(401).end();

  const token = jwt.sign({ email, tenant: user.tenant }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`);
  res.status(200).end();
}
