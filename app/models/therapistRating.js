const mongoose = require('mongoose');

const therapistRatingSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  mood: Number,
  stress: Number,
  energy: Number,
  notes: String
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('TherapistRating', therapistRatingSchema);
