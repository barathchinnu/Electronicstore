const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, 'Please provide a tag/label (e.g. FLASH SALE)'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a banner title'],
      trim: true,
    },
    sub: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Please provide a banner image url'],
      },
      publicId: {
        type: String,
      },
    },
    waMsg: {
      type: String,
      trim: true,
    },
    bg: {
      type: String,
      default: 'from-blue-900 via-indigo-900 to-slate-900',
    },
    accentBg: {
      type: String,
      default: 'bg-[#ffe500] text-slate-950',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
