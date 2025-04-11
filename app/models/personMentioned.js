const mongoose = require('mongoose');

const personMentionedSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String },
  context: { type: String },
  mentionCount: { type: Number }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('PersonMentioned', personMentionedSchema);
