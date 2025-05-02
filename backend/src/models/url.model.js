const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      default: 'anonymous',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // 30 days TTL
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for faster lookups
urlSchema.index({ shortId: 1 });
urlSchema.index({ originalUrl: 1 });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
