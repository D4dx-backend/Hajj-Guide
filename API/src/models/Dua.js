const mongoose = require('mongoose');
const mediaAssetSchema = require('./MediaAsset');

const duaSchema = new mongoose.Schema(
  {
    ritualType: {
      type: String,
      enum: ['hajj', 'umrah', 'both'],
      required: [true, 'Ritual type is required'],
    },
    ritualStep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RitualStep',
      default: null,
    },
    title: {
      arabic: { type: String, default: '' },
      malayalam: { type: String, required: [true, 'Malayalam title is required'] },
    },
    arabicText: {
      type: String,
      required: [true, 'Arabic text is required'],
    },
    malayalamMeaning: {
      type: String,
      required: [true, 'Malayalam meaning is required'],
    },
    transliteration: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['talbiyah', 'dua', 'dhikr'],
      default: 'dua',
    },
    hasAudio: {
      type: Boolean,
      default: false,
    },
    audioUrl: {
      type: String,
      default: '',
    },
    referenceLink: {
      type: String,
      default: '',
    },
    attachment: {
      type: mediaAssetSchema,
      default: null,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

duaSchema.index({ ritualType: 1, category: 1 });
duaSchema.index({ ritualStep: 1 });

module.exports = mongoose.model('Dua', duaSchema);
