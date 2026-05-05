const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema(
  {
    highlightedRitual: {
      type: String,
      enum: ['hajj', 'umrah'],
      default: 'hajj',
    },
  },
  { timestamps: true }
);

// Singleton helper — always returns the one settings document
appSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({ highlightedRitual: 'hajj' });
  }
  return settings;
};

module.exports = mongoose.model('AppSettings', appSettingsSchema);
