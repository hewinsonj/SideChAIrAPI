const mongoose = require('mongoose');

const significantPersonSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String },
  relation: { type: String },
  supportPerson: { type: Boolean, default: false },
  dateMet: { type: String },
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

module.exports = mongoose.model('SignificantPerson', significantPersonSchema);
