import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  timeRange: string;
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all saved searches
      const searches = await prisma.savedSearch.findMany({
        where: {
          OR: [
            { createdBy: session.user.email },
            { isPublic: true }
          ]
        }
      });
      return res.json(searches);

    case 'POST':
      // Create new saved search
      const { name, query, timeRange, isPublic } = req.body;
      const newSearch = await prisma.savedSearch.create({
        data: {
          name,
          query,
          timeRange,
          isPublic,
          createdBy: session.user.email
        }
      });
      return res.json(newSearch);

    case 'DELETE':
      // Delete saved search
      const { id } = req.query;
      await prisma.savedSearch.delete({
        where: { id: String(id) }
      });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 