const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')

const AISummary = require('../models/aiSummary')

// INDEX
router.get('/', requireToken, (req, res) => {
  AISummary.find()
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((summaries) => {
      const filtered = summaries.filter(s => s.conversationId !== null)
      res.status(200).json({ summaries: filtered })
    })
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  AISummary.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((summary) => {
      if (!summary || !summary.conversationId) {
        return res.sendStatus(404)
      }
      res.status(200).json({ summary })
    })
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  AISummary.create(req.body.aiSummary)
    .then((summary) => res.status(201).json({ summary }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AISummary.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((summary) => {
      if (!summary || !summary.conversationId) {
        return res.sendStatus(404)
      }
      Object.assign(summary, req.body.aiSummary)
      return summary.save()
    })
    .then((summary) => res.status(200).json({ summary }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AISummary.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((summary) => {
      if (!summary || !summary.conversationId) {
        return res.sendStatus(404)
      }
      return summary.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
