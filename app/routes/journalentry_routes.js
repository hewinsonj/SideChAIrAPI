const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const JournalEntry = require('../models/journalentry')
router.get('/ping-test', (req, res) => {
  console.log('💥💥💥 journalentry PING route hit 💥💥💥')
  res.status(200).json({ message: 'journalentry PING route hit' })
})
// const requireOwnership = require('../../lib/requireOwnership')

console.log('JournalEntry routes loaded')

// INDEX
router.get('/', requireToken, (req, res) => {
  JournalEntry.find({ owner: req.user._id })
    .then((entries) => res.status(200).json({ entries }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  console.log('JournalEntry get route HIT')
  JournalEntry.findById(req.params.id)
    // .then(requireOwnership(req))
    .then((entry) => res.status(200).json({ entry }))
    .catch((err) => handle(err, res))
})

router.post('/', requireToken, (req, res) => {
  console.log('🎯 POST /journal-entries hit')
  if (!req.body.journalentry) {
    return res.status(400).json({ error: 'Missing journalEntry data' })
  }
  req.body.journalentry.owner = req.user._id
  JournalEntry.create(req.body.journalentry)
    .then((entry) => res.status(201).json({ entry }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  JournalEntry.findById(req.params.id)
    // .then(requireOwnership(req))
    .then((entry) => {
      Object.assign(entry, req.body.journalentry)
      return entry.save()
    })
    .then((entry) => res.status(200).json({ entry }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  JournalEntry.findById(req.params.id)
    // .then(requireOwnership(req))
    .then((entry) => entry.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
