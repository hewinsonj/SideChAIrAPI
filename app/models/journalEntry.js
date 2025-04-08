const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const journalEntrySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  title: { type: String },
  content: { type: String },
  isPrivate: { type: Boolean, default: true },
  tags: [{ type: String }],
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  toObject: {
    transform: (_doc, obj) => {
      delete obj.content;
      return obj;
    }
  }
});

journalEntrySchema.plugin(fieldEncryption, {
  fields: ['content'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
