const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')
const AccessLog = require('../models/accessLog')

const Conversation = require('../models/conversation')

// INDEX - OWNERS conversations
router.get('/', requireToken, (req, res) => {
  Conversation.find({ owner: req.user._id })
    .then((conversations) => res.status(200).json({ conversations }))
    .catch((err) => handle(err, res))
})

// SHOW - Single conversation by ID
router.get('/:id', requireToken, (req, res) => {
  Conversation.findById(req.params.id)
    .then(requireOwnership(req))
    .then((conversation) => {
      if (!conversation) return res.sendStatus(404);

      const isShared = conversation.sharedWithTherapists?.some(tid =>
        tid.equals(req.user._id)
      );

      if (!isShared) return res.sendStatus(403);

      return AccessLog.create({
        userId: req.user._id,
        patientId: conversation.patientId,
        conversationId: conversation._id,
        action: 'viewed_session'
      }).then(() => conversation);
    })
    .then((conversation) => res.status(200).json({ conversation }))
    .catch((err) => handle(err, res));
})

// CREATE - New conversation
router.post('/', requireToken, requireTherapistAccess, (req, res) => {
  req.body.conversation.owner = req.user._id
  Conversation.create(req.body.conversation)
    .then((conversation) => res.status(201).json({ conversation }))
    .catch((err) => handle(err, res))
})

// UPDATE - Edit conversation
router.patch('/:id', requireToken, requireTherapistAccess, (req, res) => {
  Conversation.findById(req.params.id)
    .then(requireOwnership(req))
    .then((conversation) => {
      Object.assign(conversation, req.body.conversation)
      return conversation.save()
    })
    .then((conversation) => res.status(200).json({ conversation }))
    .catch((err) => handle(err, res))
})

// DELETE - Remove conversation
router.delete('/:id', requireToken, requireTherapistAccess, (req, res) => {
  Conversation.findById(req.params.id)
    .then(requireOwnership(req))
    .then((conversation) => conversation.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
