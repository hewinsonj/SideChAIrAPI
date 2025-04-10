const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  license: { type: String },
  specialties: [String],
  fullName: { type: String},
  bio: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      delete obj.license;
      return obj;
    }
  }
});

module.exports = mongoose.model('Therapist', therapistSchema);
