const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const PatientRating = require('../models/patientRating')

// INDEX
router.get('/', requireToken, (req, res) => {
  PatientRating.find({ owner: req.user._id })
    .then((ratings) => res.status(200).json({ ratings }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  PatientRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => res.status(200).json({ rating }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.patientRating.owner = req.user._id
  PatientRating.create(req.body.patientRating)
    .then((rating) => res.status(201).json({ rating }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  PatientRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => {
      Object.assign(rating, req.body.patientRating)
      return rating.save()
    })
    .then((rating) => res.status(200).json({ rating }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  PatientRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => {
      return rating.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
