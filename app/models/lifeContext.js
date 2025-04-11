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
  ],
  // LIFE EVENTS WILL BE HOW WE DOCUMENT MEDICATION CHANGES
  lifeEvents: [{
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ['diet', 'medication', 'fitness', 'sleep', 'work', 'family', 'relationships', 'social', 'housing', 'finance', 'school', 'legal', 'spirituality', 'self-image', 'trauma', 'health', 'other'],
      default: 'other'
    },
    importance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    relatedMessageIndex: Number,
    flaggedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('LifeContext', lifeContextSchema);

