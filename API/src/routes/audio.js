const express = require('express');
const fs = require('fs');
const path = require('path');
const Audio = require('../models/Audio');
const { protect } = require('../middleware/auth');
const { contentUpload } = require('../middleware/uploads');
const { deleteObject, uploadBuffer } = require('../utils/spaces');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads/audio');

const removeLegacyFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

router.get('/', protect, async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const audioFiles = await Audio.find(filter)
      .populate('duaReference', 'title category')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: audioFiles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id).populate('duaReference', 'title category');
    if (!audio) {
      return res.status(404).json({ success: false, message: 'Audio not found' });
    }
    return res.json({ success: true, data: audio });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  '/',
  protect,
  contentUpload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'attachmentFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, type, duaReference, referenceLink } = req.body;
      const audioFile = req.files?.audioFile?.[0];
      const attachmentFile = req.files?.attachmentFile?.[0];
      let url = req.body.url || '';
      let filename = '';
      let storageKey = '';
      let attachment = null;

      if (audioFile) {
        const uploadedAudio = await uploadBuffer({ file: audioFile, folder: 'audio' });
        url = uploadedAudio.url;
        filename = uploadedAudio.fileName;
        storageKey = uploadedAudio.key;
      }

      if (attachmentFile) {
        attachment = await uploadBuffer({ file: attachmentFile, folder: 'audio-attachments' });
      }

      if (!url) {
        return res.status(400).json({ success: false, message: 'Audio file or URL is required' });
      }

      const audio = new Audio({
        title,
        type,
        duaReference: duaReference || null,
        filename,
        storageKey,
        url,
        referenceLink: referenceLink || '',
        attachment,
      });

      await audio.save();
      return res.status(201).json({ success: true, data: audio, message: 'Audio created successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
);

router.put(
  '/:id',
  protect,
  contentUpload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'attachmentFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existing = await Audio.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Audio not found' });
      }

      existing.title = req.body.title || existing.title;
      existing.type = req.body.type || existing.type;
      existing.duaReference = req.body.duaReference !== undefined ? req.body.duaReference || null : existing.duaReference;
      existing.isActive = req.body.isActive !== undefined ? req.body.isActive === 'true' : existing.isActive;
      existing.referenceLink = req.body.referenceLink !== undefined ? req.body.referenceLink : existing.referenceLink || '';

      const audioFile = req.files?.audioFile?.[0];
      const attachmentFile = req.files?.attachmentFile?.[0];

      if (req.body.url) {
        existing.url = req.body.url;
      }

      if (audioFile) {
        if (existing.storageKey) {
          await deleteObject(existing.storageKey);
        } else if (existing.filename) {
          removeLegacyFile(existing.filename);
        }

        const uploadedAudio = await uploadBuffer({ file: audioFile, folder: 'audio' });
        existing.url = uploadedAudio.url;
        existing.filename = uploadedAudio.fileName;
        existing.storageKey = uploadedAudio.key;
      }

      if (req.body.removeAttachment === 'true' && existing.attachment?.key) {
        await deleteObject(existing.attachment.key);
        existing.attachment = null;
      }

      if (attachmentFile) {
        if (existing.attachment?.key) {
          await deleteObject(existing.attachment.key);
        }
        existing.attachment = await uploadBuffer({ file: attachmentFile, folder: 'audio-attachments' });
      }

      await existing.save();
      const populated = await existing.populate('duaReference', 'title category');
      return res.json({ success: true, data: populated, message: 'Audio updated successfully' });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
);

router.patch('/:id/toggle-active', protect, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) {
      return res.status(404).json({ success: false, message: 'Audio not found' });
    }

    audio.isActive = !audio.isActive;
    await audio.save();
    return res.json({
      success: true,
      data: audio,
      message: `Audio ${audio.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const audio = await Audio.findByIdAndDelete(req.params.id);
    if (!audio) {
      return res.status(404).json({ success: false, message: 'Audio not found' });
    }

    if (audio.storageKey) {
      await deleteObject(audio.storageKey);
    } else if (audio.filename) {
      removeLegacyFile(audio.filename);
    }

    if (audio.attachment?.key) {
      await deleteObject(audio.attachment.key);
    }

    return res.json({ success: true, message: 'Audio deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;