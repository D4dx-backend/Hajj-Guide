const express = require('express');
const Dua = require('../models/Dua');
const { protect } = require('../middleware/auth');
const { contentUpload } = require('../middleware/uploads');
const { deleteObject, uploadBuffer } = require('../utils/spaces');

const router = express.Router();

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  return JSON.parse(value);
};

const buildPayload = (body, existing = {}) => ({
  ritualType: body.ritualType || existing.ritualType,
  ritualStep:
    body.ritualStep !== undefined ? body.ritualStep || null : existing.ritualStep || null,
  title: parseJsonField(body.title, existing.title),
  arabicText: body.arabicText ?? existing.arabicText,
  malayalamMeaning: body.malayalamMeaning ?? existing.malayalamMeaning,
  transliteration: body.transliteration ?? existing.transliteration,
  category: body.category || existing.category,
  order: body.order !== undefined ? Number(body.order) : existing.order,
  hasAudio: body.hasAudio !== undefined ? body.hasAudio === 'true' : existing.hasAudio,
  audioUrl: body.audioUrl !== undefined ? body.audioUrl : existing.audioUrl || '',
  referenceLink: body.referenceLink !== undefined ? body.referenceLink : existing.referenceLink || '',
  isHighlighted:
    body.isHighlighted !== undefined ? body.isHighlighted === 'true' : existing.isHighlighted,
  isActive: body.isActive !== undefined ? body.isActive === 'true' : existing.isActive,
});

router.get('/', protect, async (req, res) => {
  try {
    const { ritualType, category, isHighlighted, isActive, ritualStep } = req.query;
    const filter = {};

    if (ritualType) filter.ritualType = ritualType;
    if (category) filter.category = category;
    if (ritualStep) filter.ritualStep = ritualStep;
    if (isHighlighted !== undefined) filter.isHighlighted = isHighlighted === 'true';
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const duas = await Dua.find(filter)
      .populate('ritualStep', 'title stepNumber ritualType')
      .sort({ ritualType: 1, order: 1, createdAt: 1 });

    return res.json({ success: true, data: duas });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id).populate('ritualStep', 'title stepNumber ritualType');
    if (!dua) {
      return res.status(404).json({ success: false, message: 'Dua not found' });
    }
    return res.json({ success: true, data: dua });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, contentUpload.single('attachmentFile'), async (req, res) => {
  try {
    const dua = new Dua(buildPayload(req.body));

    if (req.file) {
      dua.attachment = await uploadBuffer({ file: req.file, folder: 'duas' });
    }

    await dua.save();
    return res.status(201).json({ success: true, data: dua, message: 'Dua created successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, contentUpload.single('attachmentFile'), async (req, res) => {
  try {
    const existing = await Dua.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Dua not found' });
    }

    Object.assign(existing, buildPayload(req.body, existing));

    if (req.body.removeAttachment === 'true' && existing.attachment?.key) {
      await deleteObject(existing.attachment.key);
      existing.attachment = null;
    }

    if (req.file) {
      if (existing.attachment?.key) {
        await deleteObject(existing.attachment.key);
      }
      existing.attachment = await uploadBuffer({ file: req.file, folder: 'duas' });
    }

    await existing.save();
    const populated = await existing.populate('ritualStep', 'title stepNumber ritualType');
    return res.json({ success: true, data: populated, message: 'Dua updated successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.patch('/:id/highlight', protect, async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) {
      return res.status(404).json({ success: false, message: 'Dua not found' });
    }

    dua.isHighlighted = !dua.isHighlighted;
    await dua.save();
    return res.json({
      success: true,
      data: dua,
      message: `Dua ${dua.isHighlighted ? 'highlighted' : 'unhighlighted'} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/toggle-active', protect, async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) {
      return res.status(404).json({ success: false, message: 'Dua not found' });
    }

    dua.isActive = !dua.isActive;
    await dua.save();
    return res.json({
      success: true,
      data: dua,
      message: `Dua ${dua.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const dua = await Dua.findByIdAndDelete(req.params.id);
    if (!dua) {
      return res.status(404).json({ success: false, message: 'Dua not found' });
    }

    if (dua.attachment?.key) {
      await deleteObject(dua.attachment.key);
    }

    return res.json({ success: true, message: 'Dua deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;