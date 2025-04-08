const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const sessionNoteSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  content: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: { type: Boolean, default: true },
  changeLog: [
    {
      previousContent: String,
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
      delete obj.content;
      return obj;
    }
  }
});

sessionNoteSchema.plugin(fieldEncryption, {
  fields: ['content'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
