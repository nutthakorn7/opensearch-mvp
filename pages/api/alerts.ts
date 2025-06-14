import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { sendSlackNotification, sendEmailNotification } from '../../utils/notifications';

interface Alert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  timeWindow: string;
  actions: {
    type: 'email' | 'slack' | 'webhook';
    target: string;
  }[];
  isActive: boolean;
  createdBy: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all alerts
      const alerts = await prisma.alert.findMany({
        where: {
          OR: [
            { createdBy: session.user.email },
            { isPublic: true }
          ]
        }
      });
      return res.json(alerts);

    case 'POST':
      // Create new alert
      const { name, condition, threshold, timeWindow, actions, isActive } = req.body;
      const newAlert = await prisma.alert.create({
        data: {
          name,
          condition,
          threshold,
          timeWindow,
          actions,
          isActive,
          createdBy: session.user.email
        }
      });
      return res.json(newAlert);

    case 'PUT':
      // Update alert
      const { id, ...updateData } = req.body;
      const updatedAlert = await prisma.alert.update({
        where: { id: String(id) },
        data: updateData
      });
      return res.json(updatedAlert);

    case 'DELETE':
      // Delete alert
      const { id: alertId } = req.query;
      await prisma.alert.delete({
        where: { id: String(alertId) }
      });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 