const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const conversationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioUrl: { type: String },
  date: { type: Date, default: Date.now },
  therapistRatingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TherapistRating'
  },
  patientRatingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientRating'
  },
  aiSummaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AISummary'
  },
  aiScoringId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIScoring'
  },
  sharedWithTherapists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [{
    speaker: { type: String, enum: ['therapist', 'patient'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
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
  timestamps: true
});

conversationSchema.plugin(fieldEncryption, {
  fields: ['messages'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('Conversation', conversationSchema);
