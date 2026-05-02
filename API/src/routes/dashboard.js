const express = require('express');
const router = express.Router();
const RitualStep = require('../models/RitualStep');
const Dua = require('../models/Dua');
const Audio = require('../models/Audio');
const { protect } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const [
      totalRitualSteps,
      hajjSteps,
      umrahSteps,
      highlightedSteps,
      totalDuas,
      hajjDuas,
      umrahDuas,
      bothDuas,
      highlightedDuas,
      totalAudio,
      activeAudio,
    ] = await Promise.all([
      RitualStep.countDocuments(),
      RitualStep.countDocuments({ ritualType: 'hajj' }),
      RitualStep.countDocuments({ ritualType: 'umrah' }),
      RitualStep.countDocuments({ isHighlighted: true }),
      Dua.countDocuments(),
      Dua.countDocuments({ ritualType: 'hajj' }),
      Dua.countDocuments({ ritualType: 'umrah' }),
      Dua.countDocuments({ ritualType: 'both' }),
      Dua.countDocuments({ isHighlighted: true }),
      Audio.countDocuments(),
      Audio.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        totalRitualSteps,
        hajjSteps,
        umrahSteps,
        highlightedSteps,
        totalDuas,
        hajjDuas,
        umrahDuas,
        bothDuas,
        highlightedDuas,
        totalAudio,
        activeAudio,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
