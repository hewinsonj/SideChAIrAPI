const mongoose = require('mongoose');

const aiScoringSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  moodScore: Number,
  stressScore: Number,
  emotionalTone: String,
  confidence: Number
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      // This could strip sensitive scoring if needed
      return obj;
    }
  }
});

module.exports = mongoose.model('AIScoring', aiScoringSchema);
