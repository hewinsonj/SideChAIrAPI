const mongoose = require('mongoose');

const lifeContextSchema = new mongoose.Schema({
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
  occupation: String,
  goals: String,
  identityFactors: String,
  relationshipStatus: String,
  hobbies: [{ type: String }],
  significantEvents: String,
  livingSituation: String,
  sleepHealth: String,
  substanceUse: String,
  mentalHealthHistory: String,
  changeLog: [
    {
      field: String,
      previousValue: mongoose.Schema.Types.Mixed,
      updatedAt: Date,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('LifeContext', lifeContextSchema);
