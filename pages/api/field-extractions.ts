import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface FieldExtraction {
  id: string;
  name: string;
  sourceField: string;
  pattern: string;
  targetField: string;
  description: string;
  createdBy: string;
  isActive: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all field extractions
      const extractions = await prisma.fieldExtraction.findMany({
        where: {
          OR: [
            { createdBy: session.user.email },
            { isPublic: true }
          ]
        }
      });
      return res.json(extractions);

    case 'POST':
      // Create new field extraction
      const { name, sourceField, pattern, targetField, description, isActive } = req.body;
      const newExtraction = await prisma.fieldExtraction.create({
        data: {
          name,
          sourceField,
          pattern,
          targetField,
          description,
          isActive,
          createdBy: session.user.email
        }
      });
      return res.json(newExtraction);

    case 'PUT':
      // Update field extraction
      const { id, ...updateData } = req.body;
      const updatedExtraction = await prisma.fieldExtraction.update({
        where: { id: String(id) },
        data: updateData
      });
      return res.json(updatedExtraction);

    case 'DELETE':
      // Delete field extraction
      const { id: extractionId } = req.query;
      await prisma.fieldExtraction.delete({
        where: { id: String(extractionId) }
      });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 