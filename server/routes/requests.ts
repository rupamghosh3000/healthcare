import { Router, Request, Response } from 'express';
import { db } from '../db';
import { generateSupportSummary } from '../services/gemini';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// POST /api/requests - Submit a new support request
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      preferredDate,
      preferredTime,
      location,
      description,
      urgency,
      consent
    } = req.body;

    // Backend validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required (minimum 2 characters).' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'A valid phone number is required.' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Please select a support category.' });
    }
    if (!description || description.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide a description of the support needed.' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'You must agree to the civilian non-emergency terms.' });
    }

    // Step 1: Save request in DB first (so it's guaranteed stored even if AI fails)
    let newRequest = db.createRequest({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: category.trim(),
      preferredDate: preferredDate || 'Flexible',
      preferredTime: preferredTime || 'Flexible',
      location: location || 'Not specified',
      description: description.trim(),
      urgency: ['normal', 'soon', 'urgent'].includes(urgency) ? urgency : 'normal',
      status: 'Pending'
    });

    // Step 2: Attempt AI summary with Gemini
    let aiSummaryWarning: string | null = null;
    try {
      const summary = await generateSupportSummary({
        description: description.trim(),
        category,
        location,
        preferredDate,
        preferredTime,
        urgency
      });

      // Update request with generated AI summary
      const updated = db.updateRequest(newRequest.id, { aiSummary: summary });
      if (updated) {
        newRequest = updated;
      }
    } catch (aiErr) {
      console.error('AI summarization failed, request preserved safely:', aiErr);
      aiSummaryWarning = 'Your request was saved successfully, but the automatic summary is temporarily unavailable.';
    }

    return res.status(201).json({
      success: true,
      message: 'Support request submitted successfully.',
      request: newRequest,
      warning: aiSummaryWarning
    });
  } catch (error) {
    console.error('Error creating support request:', error);
    return res.status(500).json({ error: 'Something went wrong while submitting your request. Please try again.' });
  }
});

// GET /api/requests - List requests with query filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const { search, category, status, urgency } = req.query;

    let requests = db.getRequests();

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      requests = requests.filter(
        (r) =>
          r.id.toLowerCase().includes(s) ||
          r.name.toLowerCase().includes(s) ||
          r.email.toLowerCase().includes(s) ||
          r.phone.toLowerCase().includes(s) ||
          r.location.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s)
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      requests = requests.filter((r) => r.category.toLowerCase() === category.toLowerCase());
    }

    if (status && typeof status === 'string' && status !== 'All') {
      requests = requests.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    if (urgency && typeof urgency === 'string' && urgency !== 'All') {
      requests = requests.filter((r) => r.urgency.toLowerCase() === urgency.toLowerCase());
    }

    return res.json({ requests, total: requests.length });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ error: 'Unable to retrieve support requests.' });
  }
});

// GET /api/requests/:id - Single request details
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const request = db.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: `Request with ID ${id} not found.` });
    }
    return res.json({ request });
  } catch (error) {
    console.error('Error fetching single request:', error);
    return res.status(500).json({ error: 'Unable to retrieve request details.' });
  }
});

// PATCH /api/requests/:id - Update status or assign volunteer (Admin protected)
router.patch('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, assignedVolunteerId, assignedVolunteerName, notes } = req.body;

    const existing = db.getRequestById(id);
    if (!existing) {
      return res.status(404).json({ error: `Request with ID ${id} not found.` });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (assignedVolunteerId !== undefined) updates.assignedVolunteerId = assignedVolunteerId;
    if (assignedVolunteerName !== undefined) updates.assignedVolunteerName = assignedVolunteerName;

    const updated = db.updateRequest(id, updates);
    return res.json({ success: true, message: 'Request status updated.', request: updated });
  } catch (error) {
    console.error('Error updating request:', error);
    return res.status(500).json({ error: 'Unable to update request.' });
  }
});

// DELETE /api/requests/:id - Delete a request (Admin protected)
router.delete('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteRequest(id);
    if (!deleted) {
      return res.status(404).json({ error: `Request with ID ${id} not found.` });
    }
    return res.json({ success: true, message: `Request ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting request:', error);
    return res.status(500).json({ error: 'Unable to delete request.' });
  }
});

export default router;
