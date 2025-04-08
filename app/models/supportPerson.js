const mongoose = require('mongoose');

const supportPersonSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  name: { type: String, required: true },
  relation: { type: String },
  contact: { type: String },
  notes: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('SupportPerson', supportPersonSchema);
