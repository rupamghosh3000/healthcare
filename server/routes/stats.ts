import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = db.getStats();
    return res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({ error: 'Failed to retrieve stats.' });
  }
});

router.get('/faqs', (req: Request, res: Response) => {
  try {
    const faqs = db.getFAQs();
    return res.json({ faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({ error: 'Failed to retrieve FAQs.' });
  }
});

export default router;
