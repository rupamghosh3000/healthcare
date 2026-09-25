import { Router, Request, Response } from 'express';
import { generateSupportSummary, answerAIChatQuestion, searchFacilitiesWithGoogleMaps } from '../services/gemini';

const router = Router();

// POST /api/ai/summarize - On-demand AI summarization endpoint
router.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { description, category, location, preferredDate, preferredTime, urgency } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required for summarization.' });
    }

    const summary = await generateSupportSummary({
      description,
      category,
      location,
      preferredDate,
      preferredTime,
      urgency
    });

    return res.json({ summary });
  } catch (error) {
    console.error('Error summarizing via AI:', error);
    return res.status(500).json({ error: 'AI summary is temporarily unavailable.' });
  }
});

// POST /api/ai/chat - Multi-turn AI Chatbot with role selection & model tiers
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, role, modelTier } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const result = await answerAIChatQuestion({
      message: message.trim(),
      history,
      role,
      modelTier
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in AI chatbot:', error);
    return res.status(500).json({
      answer: "I am temporarily having trouble reaching the knowledge network. Please check our FAQ page or speak with a local coordinator directly.",
      isEmergency: false,
      modelUsed: 'Offline Fallback'
    });
  }
});

// POST /api/ai/maps-search - Google Maps Grounding via gemini-3.5-flash
router.post('/maps-search', async (req: Request, res: Response) => {
  try {
    const { query, location } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const result = await searchFacilitiesWithGoogleMaps({
      query: query.trim(),
      userLocation: location
    });

    return res.json(result);
  } catch (error) {
    console.error('Error in maps-search endpoint:', error);
    return res.status(500).json({ error: 'Failed to search facilities with Google Maps.' });
  }
});

export default router;
