const express = require('express');
const router = express.Router();
const Therapist = require('../models/therapist');
const requireToken = require('../../lib/requireToken');
const requireOwnership = require('../../lib/requireOwnership');
const handle = require('../../lib/handle');
const requireTherapistAccess = require('../../lib/requireTherapistAccess');

// INDEX - Get all therapist profiles for the logged-in user
router.get('/', requireToken, requireTherapistAccess, (req, res) => {
  Therapist.find({ $or: [{ userAccount: req.user._id }, { owner: req.user._id }] })
    .then(handle.success(res))
    .catch(handle.error(res));
});

// SHOW - Get one therapist profile by ID
router.get('/:id', requireToken, (req, res) => {
  Therapist.findById(req.params.id)
    .then(handle.foundOr404)
    .then(requireOwnership(req.user))
    .then(handle.success(res))
    .catch(handle.error(res));
});

// CREATE - Create a new therapist profile
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  req.body.owner = req.user._id;
  req.body.userAccount = req.user._id;
  Therapist.create(req.body)
    .then(handle.success(res, 201))
    .catch(handle.error(res));
});

// UPDATE - Update a therapist profile
router.put('/:id', requireToken, requireTherapistAccess, (req, res) => {
  Therapist.findById(req.params.id)
    .then(handle.foundOr404)
    .then(requireOwnership(req.user))
    .then((record) => Object.assign(record, req.body).save())
    .then(handle.success(res))
    .catch(handle.error(res));
});

// DESTROY - Delete a therapist profile
router.delete('/:id', requireToken, (req, res) => {
  Therapist.findById(req.params.id)
    .then(handle.foundOr404)
    .then(requireOwnership(req.user))
    .then((record) => record.deleteOne())
    .then(() => res.sendStatus(204))
    .catch(handle.error(res));
});

// SHOW - Get patient's therapists
router.get('/patients/:patientId/therapists', requireToken, requireTherapistAccess, (req, res) => {
  const Patient = require('../models/patient');

  Patient.findById(req.params.patientId)
    .populate('therapists')
    .then((patient) => {
      if (!patient) return res.sendStatus(404);
      res.status(200).json({ therapists: patient.therapists });
    })
    .catch((err) => handle.error(res)(err));
});

module.exports = router;