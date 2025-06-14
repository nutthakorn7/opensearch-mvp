import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface Visualization {
  id: string;
  name: string;
  type: 'timeline' | 'pie' | 'heatmap' | 'bar';
  query: string;
  timeRange: string;
  config: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    aggregation?: string;
  };
  createdBy: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all visualizations
      const visualizations = await prisma.visualization.findMany({
        where: {
          OR: [
            { createdBy: session.user.email },
            { isPublic: true }
          ]
        }
      });
      return res.json(visualizations);

    case 'POST':
      // Create new visualization
      const { name, type, query, timeRange, config } = req.body;
      const newVisualization = await prisma.visualization.create({
        data: {
          name,
          type,
          query,
          timeRange,
          config,
          createdBy: session.user.email
        }
      });
      return res.json(newVisualization);

    case 'PUT':
      // Update visualization
      const { id, ...updateData } = req.body;
      const updatedVisualization = await prisma.visualization.update({
        where: { id: String(id) },
        data: updateData
      });
      return res.json(updatedVisualization);

    case 'DELETE':
      // Delete visualization
      const { id: vizId } = req.query;
      await prisma.visualization.delete({
        where: { id: String(vizId) }
      });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 