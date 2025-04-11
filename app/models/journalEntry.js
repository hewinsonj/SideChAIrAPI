const mongoose = require('mongoose');
const fieldEncryption = require('mongoose-field-encryption').fieldEncryption;

const journalEntrySchema = new mongoose.Schema({
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
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String },
  content: { type: String },
  isPrivate: { type: Boolean, default: true },
  relatedTreatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TreatmentRecord'
  },
  relatedTherapistRating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TherapistRating'
  },
  relatedTherapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist'
  },
  relatedWeeklyReflection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WeeklyReflection'
  },
  relatedSupportPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupportPerson'
  },
  relatedSessionNote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionNote'
  },
  relatedOrganization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  relatedLifeContext: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LifeContext'
  },
  relatedFlaggedSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FlaggedSession'
  },
  relatedExportLog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExportLog'
  },
  relatedConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  relatedAITheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AITheme'
  },
  relatedAIScoring: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIScoring'
  },
  relatedAISummary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AISummary'
  },
  relatedAccessLog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccessLog'
  },
  relatedPatientRating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PatientRating'
  },
  // Use tags to categorize journal entries, e.g. "comment:treatment", "comment:rating", "comment:therapist"
  tags: [{ type: String }],
  aiSummary: { type: String },
  createdAt: { type: Date, default: Date.now },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  toObject: {
    transform: (_doc, obj) => {
      delete obj.content;
      return obj;
    }
  }
});

journalEntrySchema.virtual('isRegular').get(function () {
  return !(
    this.relatedTreatment ||
    this.relatedTherapistRating ||
    this.relatedTherapist ||
    this.relatedWeeklyReflection ||
    this.relatedSupportPerson ||
    this.relatedSessionNote ||
    this.relatedOrganization ||
    this.relatedLifeContext ||
    this.relatedFlaggedSession ||
    this.relatedExportLog ||
    this.relatedConversation ||
    this.relatedAITheme ||
    this.relatedAIScoring ||
    this.relatedAISummary ||
    this.relatedAccessLog ||
    this.relatedPatientRating
  );
});

journalEntrySchema.plugin(fieldEncryption, {
  fields: ['content', 'sharedWith'],
  secret: process.env.ENCRYPTION_SECRET
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
