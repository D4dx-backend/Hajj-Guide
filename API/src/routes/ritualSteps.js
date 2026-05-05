const express = require('express');
const RitualStep = require('../models/RitualStep');
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
  stepNumber: body.stepNumber !== undefined ? Number(body.stepNumber) : existing.stepNumber,
  title: parseJsonField(body.title, existing.title),
  description: parseJsonField(body.description, existing.description),
  instructions: parseJsonField(body.instructions, existing.instructions || []),
  referenceLink: body.referenceLink !== undefined ? body.referenceLink : existing.referenceLink || '',
  isHighlighted:
    body.isHighlighted !== undefined ? body.isHighlighted === 'true' : existing.isHighlighted,
  isActive: body.isActive !== undefined ? body.isActive === 'true' : existing.isActive,
});

router.get('/', async (req, res) => {
  try {
    const { ritualType, isHighlighted, isActive } = req.query;
    const filter = {};

    if (ritualType) filter.ritualType = ritualType;
    if (isHighlighted !== undefined) filter.isHighlighted = isHighlighted === 'true';
    // Mobile app always gets active steps only
    filter.isActive = isActive !== undefined ? isActive === 'true' : true;

    const steps = await RitualStep.find(filter).sort({ ritualType: 1, stepNumber: 1 });
    res.json({ success: true, data: steps });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const step = await RitualStep.findById(req.params.id);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Ritual step not found' });
    }
    return res.json({ success: true, data: step });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, contentUpload.single('attachmentFile'), async (req, res) => {
  try {
    const step = new RitualStep(buildPayload(req.body));

    if (req.file) {
      step.attachment = await uploadBuffer({ file: req.file, folder: 'ritual-steps' });
    }

    await step.save();
    res.status(201).json({ success: true, data: step, message: 'Ritual step created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', protect, contentUpload.single('attachmentFile'), async (req, res) => {
  try {
    const existing = await RitualStep.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ritual step not found' });
    }

    const payload = buildPayload(req.body, existing);
    Object.assign(existing, payload);

    if (req.body.removeAttachment === 'true' && existing.attachment?.key) {
      await deleteObject(existing.attachment.key);
      existing.attachment = null;
    }

    if (req.file) {
      if (existing.attachment?.key) {
        await deleteObject(existing.attachment.key);
      }
      existing.attachment = await uploadBuffer({ file: req.file, folder: 'ritual-steps' });
    }

    await existing.save();
    return res.json({ success: true, data: existing, message: 'Ritual step updated successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.patch('/:id/highlight', protect, async (req, res) => {
  try {
    const step = await RitualStep.findById(req.params.id);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Ritual step not found' });
    }

    step.isHighlighted = !step.isHighlighted;
    await step.save();
    return res.json({
      success: true,
      data: step,
      message: `Ritual step ${step.isHighlighted ? 'highlighted' : 'unhighlighted'} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/toggle-active', protect, async (req, res) => {
  try {
    const step = await RitualStep.findById(req.params.id);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Ritual step not found' });
    }

    step.isActive = !step.isActive;
    await step.save();
    return res.json({
      success: true,
      data: step,
      message: `Ritual step ${step.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const step = await RitualStep.findByIdAndDelete(req.params.id);
    if (!step) {
      return res.status(404).json({ success: false, message: 'Ritual step not found' });
    }

    if (step.attachment?.key) {
      await deleteObject(step.attachment.key);
    }

    return res.json({ success: true, message: 'Ritual step deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;