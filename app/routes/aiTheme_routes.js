const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')

const AITheme = require('../models/aiTheme')

// INDEX
router.get('/', requireToken, (req, res) => {
  AITheme.find()
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((themes) => {
      const filtered = themes.filter(t => t.conversationId !== null)
      res.status(200).json({ themes: filtered })
    })
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  AITheme.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((theme) => {
      if (!theme || !theme.conversationId) {
        return res.sendStatus(404)
      }
      res.status(200).json({ theme })
    })
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  AITheme.create(req.body.aiTheme)
    .then((theme) => res.status(201).json({ theme }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AITheme.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((theme) => {
      if (!theme || !theme.conversationId) {
        return res.sendStatus(404)
      }
      Object.assign(theme, req.body.aiTheme)
      return theme.save()
    })
    .then((theme) => res.status(200).json({ theme }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, requireTherapistAccess, (req, res) => {
  AITheme.findById(req.params.id)
    .populate({
      path: 'conversationId',
      match: { owner: req.user._id }
    })
    .then((theme) => {
      if (!theme || !theme.conversationId) {
        return res.sendStatus(404)
      }
      return theme.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
