const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const SessionNote = require('../models/sessionNote')

// INDEX
router.get('/', requireToken, (req, res) => {
  SessionNote.find({ owner: req.user._id })
    .then((notes) => res.status(200).json({ notes }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  SessionNote.findById(req.params.id)
    .then(requireOwnership(req))
    .then((note) => res.status(200).json({ note }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.sessionNote.owner = req.user._id
  SessionNote.create(req.body.sessionNote)
    .then((note) => res.status(201).json({ note }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  SessionNote.findById(req.params.id)
    .then(requireOwnership(req))
    .then((note) => {
      Object.assign(note, req.body.sessionNote)
      return note.save()
    })
    .then((note) => res.status(200).json({ note }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  SessionNote.findById(req.params.id)
    .then(requireOwnership(req))
    .then((note) => {
      return note.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
