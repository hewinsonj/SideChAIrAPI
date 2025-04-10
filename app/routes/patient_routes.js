const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')

const Patient = require('../models/patient')

router.get('/', requireToken, requireTherapistAccess, (req, res) => {
  Patient.find({ therapists: req.user._id })
    .then((patients) => res.status(200).json({ patients }))
    .catch((err) => handle(err, res))
})
// SHOW
router.get('/:id', requireToken, (req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => {
      if (!patient || !patient.owner.equals(req.user._id)) {
        return res.sendStatus(404)
      }
      res.status(200).json({ patient })
    })
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  req.body.patient.owner = req.user._id
  Patient.create(req.body.patient)
    .then((patient) => res.status(201).json({ patient }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => {
      if (!patient || !patient.owner.equals(req.user._id)) {
        return res.sendStatus(404)
      }
      Object.assign(patient, req.body.patient)
      return patient.save()
    })
    .then((patient) => res.status(200).json({ patient }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  Patient.findById(req.params.id)
    .then((patient) => {
      if (!patient || !patient.owner.equals(req.user._id)) {
        return res.sendStatus(404)
      }
      return patient.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
