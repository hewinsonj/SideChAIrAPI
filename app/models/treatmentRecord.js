const mongoose = require('mongoose')

const treatmentRecordSchema = new mongoose.Schema({
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['therapy', 'medication', 'exercise', 'diet', 'other'],
      required: true
    },
    title: { type: String, required: true },
    description: String,
    dateAdministered: { type: Date, default: Date.now },
    notes: String,
    visibility: {
      type: String,
      enum: ['therapist-only', 'shared'],
      default: 'shared'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('TreatmentRecord', treatmentRecordSchema);