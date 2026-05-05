const express = require('express');
const router = express.Router();
const AppSettings = require('../models/AppSettings');
const { protect } = require('../middleware/auth');

// GET /api/settings  — public (mobile app calls this)
router.get('/', async (_req, res) => {
  try {
    const settings = await AppSettings.getSingleton();
    res.json({ success: true, data: { highlightedRitual: settings.highlightedRitual } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/settings  — admin only
router.put('/', protect, async (req, res) => {
  try {
    const { highlightedRitual } = req.body;
    if (!['hajj', 'umrah'].includes(highlightedRitual)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid value. Must be "hajj" or "umrah".',
      });
    }
    const settings = await AppSettings.getSingleton();
    settings.highlightedRitual = highlightedRitual;
    await settings.save();
    res.json({ success: true, data: { highlightedRitual: settings.highlightedRitual } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
