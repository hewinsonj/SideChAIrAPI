const mongoose = require('mongoose');

const weeklyReflectionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiSummary: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('WeeklyReflection', weeklyReflectionSchema);
