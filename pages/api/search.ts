import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  if (!token) return res.status(401).end();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const query = req.body.query || '*';
    const opensearchUrl = process.env.OPENSEARCH_URL || 'http://localhost:9200';

    const result = await axios.post(`${opensearchUrl}/logs-${decoded.tenant}-*/_search`, {
      query: {
        query_string: {
          query: query || '*'
        }
      },
      size: 50
    }, {
      auth: process.env.OPENSEARCH_USER ? {
        username: process.env.OPENSEARCH_USER,
        password: process.env.OPENSEARCH_PASS
      } : undefined
    });

    res.status(200).json(result.data);
  } catch (err) {
    res.status(401).end();
  }
}
