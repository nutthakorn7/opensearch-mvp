import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { generatePDF, generateCSV } from '../../utils/reportGenerators';

interface Report {
  id: string;
  name: string;
  query: string;
  timeRange: string;
  schedule: string; // cron expression
  format: 'pdf' | 'csv';
  recipients: string[];
  createdBy: string;
  lastRun: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Get all reports
      const reports = await prisma.report.findMany({
        where: {
          OR: [
            { createdBy: session.user.email },
            { isPublic: true }
          ]
        }
      });
      return res.json(reports);

    case 'POST':
      // Create new report
      const { name, query, timeRange, schedule, format, recipients } = req.body;
      const newReport = await prisma.report.create({
        data: {
          name,
          query,
          timeRange,
          schedule,
          format,
          recipients,
          createdBy: session.user.email
        }
      });
      return res.json(newReport);

    case 'PUT':
      // Update report
      const { id, ...updateData } = req.body;
      const updatedReport = await prisma.report.update({
        where: { id: String(id) },
        data: updateData
      });
      return res.json(updatedReport);

    case 'DELETE':
      // Delete report
      const { id: reportId } = req.query;
      await prisma.report.delete({
        where: { id: String(reportId) }
      });
      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 