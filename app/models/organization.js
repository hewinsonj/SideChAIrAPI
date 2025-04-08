const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['clinic', 'practice', 'team'], default: 'practice' },
  license: String,
  memberLimit: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
}, {
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
