const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  therapists: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fullName: { type: String, required: true },
  dob: { type: Date },
  notes: { type: String }
}, {
  timestamps: true,
  toObject: {
    transform: (_doc, obj) => {
      delete obj.notes;
      return obj;
    }
  }
});

patientSchema.add({
  patientProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }
});

console.log('MONGODB_URI:', process.env.MONGODB_URI);

module.exports = mongoose.model('Patient', patientSchema);
