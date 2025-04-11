const express = require('express');
const router = express.Router();
const TreatmentRecord = require('../models/treatmentRecord');
const requireToken = require('../../lib/requireToken');
const handle = require('../../lib/handle');

// INDEX - Get all treatment records visible to logged-in user
router.get('/', requireToken, (req, res) => {
  const query = {
    $or: [
      { therapistId: req.user._id },
      { patientId: req.user._id, visibility: 'shared' }
    ]
  };
  TreatmentRecord.find(query)
    .populate('patientId')
    .populate('therapistId')
    .then((records) => res.status(200).json({ treatmentRecords: records }))
    .catch((err) => handle(err, res));
});

// SHOW - Get a specific treatment record by ID
router.get('/:id', requireToken, (req, res) => {
  TreatmentRecord.findById(req.params.id)
    .populate('patientId')
    .populate('therapistId')
    .then((record) => {
      if (!record) return res.sendStatus(404);
      const userId = req.user._id.toString();
      const isTherapist = record.therapistId._id.toString() === userId;
      const isPatient = record.patientId._id.toString() === userId;
      if (isTherapist || (isPatient && record.visibility === 'shared')) {
        res.status(200).json({ treatmentRecord: record });
      } else {
        res.sendStatus(403);
      }
    })
    .catch((err) => handle(err, res));
});

// CREATE - Therapist creates new treatment record
router.post('/', requireToken, (req, res) => {
  const recordData = req.body.treatmentRecord;
  recordData.therapistId = req.user._id;
  TreatmentRecord.create(recordData)
    .then((created) => res.status(201).json({ treatmentRecord: created }))
    .catch((err) => handle(err, res));
});

// UPDATE - Therapist updates their own record
router.patch('/:id', requireToken, (req, res) => {
  TreatmentRecord.findById(req.params.id)
    .then((record) => {
      if (!record) return res.sendStatus(404);
      if (record.therapistId.toString() !== req.user._id.toString()) {
        return res.sendStatus(403);
      }
      return TreatmentRecord.findByIdAndUpdate(req.params.id, req.body.treatmentRecord, { new: true });
    })
    .then((updated) => res.status(200).json({ treatmentRecord: updated }))
    .catch((err) => handle(err, res));
});

// DELETE - Therapist deletes their own record
router.delete('/:id', requireToken, (req, res) => {
  TreatmentRecord.findById(req.params.id)
    .then((record) => {
      if (!record) return res.sendStatus(404);
      if (record.therapistId.toString() !== req.user._id.toString()) {
        return res.sendStatus(403);
      }
      return record.deleteOne();
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res));
});

module.exports = router;
