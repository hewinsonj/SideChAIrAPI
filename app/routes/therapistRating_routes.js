const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const TherapistRating = require('../models/therapistRating')

// INDEX
router.get('/', requireToken, (req, res) => {
  TherapistRating.find({ owner: req.user._id })
    .then((ratings) => res.status(200).json({ ratings }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  TherapistRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => res.status(200).json({ rating }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.therapistRating.owner = req.user._id
  TherapistRating.create(req.body.therapistRating)
    .then((rating) => res.status(201).json({ rating }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  TherapistRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => {
      Object.assign(rating, req.body.therapistRating)
      return rating.save()
    })
    .then((rating) => res.status(200).json({ rating }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  TherapistRating.findById(req.params.id)
    .then(requireOwnership(req))
    .then((rating) => {
      return rating.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
