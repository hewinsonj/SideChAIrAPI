const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')

const AIScoring = require('../models/aiScoring')

// INDEX - Get all AI scorings for authenticated user
router.get('/', requireToken, (req, res) => {
  AIScoring.find()
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((scorings) => {
      const filtered = scorings.filter(s => s.conversationId !== null)
      res.status(200).json({ scorings: filtered })
    })
    .catch((err) => handle(err, res))
})

// SHOW - Get one AI scoring by ID
router.get('/:id', requireToken, (req, res) => {
  AIScoring.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((scoring) => {
      if (!scoring || !scoring.conversationId) {
        return res.sendStatus(404)
      }
      res.status(200).json({ scoring })
    })
    .catch((err) => handle(err, res))
})

// CREATE - Add new AI scoring
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  AIScoring.create(req.body.aiScoring)
    .then((scoring) => res.status(201).json({ scoring }))
    .catch((err) => handle(err, res))
})

// UPDATE - Modify AI scoring
router.patch('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AIScoring.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((scoring) => {
      if (!scoring || !scoring.conversationId) {
        return res.sendStatus(404)
      }
      Object.assign(scoring, req.body.aiScoring)
      return scoring.save()
    })
    .then((scoring) => res.status(200).json({ scoring }))
    .catch((err) => handle(err, res))
})

// DELETE - Remove AI scoring
router.delete('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AIScoring.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((scoring) => {
      if (!scoring || !scoring.conversationId) {
        return res.sendStatus(404)
      }
      return scoring.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
