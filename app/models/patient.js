const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: { type: String, required: true },
  dob: { type: Date },
  notes: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      delete obj.notes;
      return obj;
    }
  }
});

module.exports = mongoose.model('Patient', patientSchema);
