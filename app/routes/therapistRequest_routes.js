const express = require('express');
const router = express.Router();
const TherapistRequest = require('../models/therapistRequest');
const requireToken = require('../../lib/requireToken');
const handle = require('../../lib/handle');
const Patient = require('../models/patient');

// INDEX - Get requests related to logged in user (therapist or patient)
router.get('/', requireToken, (req, res) => {
  TherapistRequest.find({
    $or: [{ therapistId: req.user._id }, { patientId: req.user._id }]
  })
    .then((requests) => res.status(200).json({ requests }))
    .catch((err) => handle(err, res));
});

// CREATE - Therapist sends request to connect with patient
router.post('/', requireToken, (req, res) => {
  const request = {
    therapistId: req.user._id,
    patientId: req.body.patientId,
    message: req.body.message
  };
  TherapistRequest.create(request)
    .then((created) => res.status(201).json({ request: created }))
    .catch((err) => handle(err, res));
});

// PATCH - Patient approves/denies request
router.patch('/:id', requireToken, (req, res) => {
  TherapistRequest.findById(req.params.id)
    .then((request) => {
      if (!request || !request.patientId.equals(req.user._id)) {
        return res.sendStatus(403);
      }
      request.status = req.body.status;
      if (request.status === 'approved') {
        return Patient.findById(request.patientId).then((patient) => {
          if (!patient.therapists.includes(request.therapistId)) {
            patient.therapists.push(request.therapistId);
            return patient.save();
          }
        }).then(() => request);
      }
      return request;
    })
    .then((updated) => res.status(200).json({ request: updated }))
    .catch((err) => handle(err, res));
});

module.exports = router;
