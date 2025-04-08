const mongoose = require('mongoose');

const keywordSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  word: { type: String, required: true },
  relevanceScore: Number
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('Keyword', keywordSchema);
