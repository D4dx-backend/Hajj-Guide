const mongoose = require('mongoose');
const mediaAssetSchema = require('./MediaAsset');

const multiLangSchema = {
  arabic: { type: String, default: '' },
  malayalam: { type: String, default: '' },
};

const ritualStepSchema = new mongoose.Schema(
  {
    ritualType: {
      type: String,
      enum: ['hajj', 'umrah'],
      required: [true, 'Ritual type is required'],
    },
    stepNumber: {
      type: Number,
      required: [true, 'Step number is required'],
    },
    title: multiLangSchema,
    description: multiLangSchema,
    instructions: [multiLangSchema],
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
  },
  { timestamps: true }
);

ritualStepSchema.index({ ritualType: 1, stepNumber: 1 });

module.exports = mongoose.model('RitualStep', ritualStepSchema);
