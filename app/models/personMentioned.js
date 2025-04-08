const mongoose = require('mongoose');

const personMentionedSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  name: { type: String, required: true },
  role: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('PersonMentioned', personMentionedSchema);
