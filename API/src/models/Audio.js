const mongoose = require('mongoose');
const mediaAssetSchema = require('./MediaAsset');

const audioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Audio title is required'],
    },
    type: {
      type: String,
      enum: ['talbiyah', 'dua', 'dhikr'],
      required: [true, 'Audio type is required'],
    },
    duaReference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dua',
      default: null,
    },
    filename: {
      type: String,
      default: '',
    },
    storageKey: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: [true, 'Audio URL is required'],
    },
    referenceLink: {
      type: String,
      default: '',
    },
    attachment: {
      type: mediaAssetSchema,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audio', audioSchema);
