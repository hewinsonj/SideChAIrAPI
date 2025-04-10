const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const ExportLog = require('../models/exportLog')

// INDEX
router.get('/', requireToken, (req, res) => {
  ExportLog.find({ owner: req.user._id })
    .then((logs) => res.status(200).json({ logs }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  ExportLog.findById(req.params.id)
    .then(requireOwnership(req))
    .then((log) => res.status(200).json({ log }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.exportLog.owner = req.user._id
  ExportLog.create(req.body.exportLog)
    .then((log) => res.status(201).json({ log }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  ExportLog.findById(req.params.id)
    .then(requireOwnership(req))
    .then((log) => {
      Object.assign(log, req.body.exportLog)
      return log.save()
    })
    .then((log) => res.status(200).json({ log }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  ExportLog.findById(req.params.id)
    .then(requireOwnership(req))
    .then((log) => log.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
