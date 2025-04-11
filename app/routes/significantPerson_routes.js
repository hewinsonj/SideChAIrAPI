const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const SignificantPerson = require('../models/significantPerson')

// INDEX
router.get('/', requireToken, (req, res) => {
  SignificantPerson.find({ patientId: req.user._id })
    .then((people) => res.status(200).json({ people }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  SignificantPerson.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => res.status(200).json({ person }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  SignificantPerson.create(req.body.significantPerson)
    .then((person) => res.status(201).json({ person }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  SignificantPerson.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => {
      Object.assign(person, req.body.significantPerson)
      return person.save()
    })
    .then((person) => res.status(200).json({ person }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  SignificantPerson.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => {
      return person.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
