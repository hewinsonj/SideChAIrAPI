const mongoose = require('mongoose');

const aiThemeSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  rawLabel: { type: String, required: true },
  normalizedTo: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

module.exports = mongoose.model('AITheme', aiThemeSchema);
