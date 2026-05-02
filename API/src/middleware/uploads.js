const multer = require('multer');

const storage = multer.memoryStorage();

const attachmentMime = /^(image|audio|video)\//;
const audioMime = /^audio\//;

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'audioFile') {
    if (audioMime.test(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Only audio files are allowed for audio uploads'));
  }

  if (attachmentMime.test(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new Error('Only image, audio, and video files are allowed as attachments'));
};

const contentUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 60 * 1024 * 1024 },
});

module.exports = { contentUpload };