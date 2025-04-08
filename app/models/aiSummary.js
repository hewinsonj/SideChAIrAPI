const mongoose = require('mongoose');

const aiSummarySchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  text: { type: String, required: true },
  model: { type: String, default: 'gpt-3.5' },
  confidence: Number,
  changeLog: [
    {
      previousText: String,
      editedAt: Date,
      editedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      delete obj.text; // Optionally hide AI-generated summary if needed
      return obj;
    }
  }
});

module.exports = mongoose.model('AISummary', aiSummarySchema);
