const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const conversationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  transcript: { type: String, required: true },
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
  }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      delete obj.transcript;
      return obj;
    }
  }
});

conversationSchema.plugin(fieldEncryption, {
  fields: ['transcript'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('Conversation', conversationSchema);
