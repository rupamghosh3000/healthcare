import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// POST /api/volunteers - Register a new volunteer
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      supportAreas,
      availability,
      experience,
      introNote
    } = req.body;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full legal name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!phone || phone.trim().length < 7) {
      return res.status(400).json({ error: 'A valid phone number is required.' });
    }
    if (!city || city.trim().length < 2) {
      return res.status(400).json({ error: 'City / Municipal ward is required.' });
    }
    if (!supportAreas || !Array.isArray(supportAreas) || supportAreas.length === 0) {
      return res.status(400).json({ error: 'Please select at least one support category.' });
    }
    if (!availability || !Array.isArray(availability) || availability.length === 0) {
      return res.status(400).json({ error: 'Please select your typical availability.' });
    }

    const newVolunteer = db.createVolunteer({
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      supportAreas,
      availability,
      experience: experience || 'none',
      introNote: introNote ? introNote.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for joining CareConnect. Your registration has been received.',
      volunteer: newVolunteer
    });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return res.status(500).json({ error: 'Something went wrong while registering your profile. Please try again.' });
  }
});

// GET /api/volunteers - List volunteers (Admin protected or public count)
router.get('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { search, status, area } = req.query;

    let volunteers = db.getVolunteers();

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      volunteers = volunteers.filter(
        (v) =>
          v.id.toLowerCase().includes(s) ||
          v.name.toLowerCase().includes(s) ||
          v.email.toLowerCase().includes(s) ||
          v.city.toLowerCase().includes(s) ||
          v.experience.toLowerCase().includes(s)
      );
    }

    if (status && typeof status === 'string' && status !== 'All') {
      volunteers = volunteers.filter((v) => v.status.toLowerCase() === status.toLowerCase());
    }

    if (area && typeof area === 'string' && area !== 'All') {
      volunteers = volunteers.filter((v) =>
        v.supportAreas.some((a) => a.toLowerCase().includes(area.toLowerCase()))
      );
    }

    return res.json({ volunteers, total: volunteers.length });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return res.status(500).json({ error: 'Unable to retrieve volunteers.' });
  }
});

// PATCH /api/volunteers/:id - Update volunteer status
router.patch('/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: 'Invalid volunteer status value.' });
    }

    const updated = db.updateVolunteer(id, { status });
    if (!updated) {
      return res.status(404).json({ error: `Volunteer with ID ${id} not found.` });
    }

    return res.json({ success: true, message: 'Volunteer status updated.', volunteer: updated });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return res.status(500).json({ error: 'Unable to update volunteer.' });
  }
});

export default router;
