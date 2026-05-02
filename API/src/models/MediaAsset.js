const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: '',
    },
    originalName: {
      type: String,
      default: '',
    },
    mimeType: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    kind: {
      type: String,
      enum: ['image', 'audio', 'video', 'file'],
      default: 'file',
    },
  },
  { _id: false }
);

module.exports = mediaAssetSchema;