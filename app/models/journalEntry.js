const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const journalentrySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

journalentrySchema.plugin(fieldEncryption, {
  fields: ['content'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('JournalEntry', journalentrySchema);
