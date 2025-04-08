const mongoose = require('mongoose');

const exportLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  format: {
    type: String,
    enum: ['PDF', 'CSV', 'JSON'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  includesAI: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('ExportLog', exportLogSchema);
