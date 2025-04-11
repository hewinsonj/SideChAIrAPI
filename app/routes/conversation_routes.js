const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')
const requireTherapistAccess = require('../../lib/requireTherapistAccess')
const AccessLog = require('../models/accessLog')

const Conversation = require('../models/conversation')
const PersonMentioned = require('../models/personMentioned')
const SignificantPerson = require('../models/significantPerson')

// INDEX - OWNERS conversations
router.get('/', requireToken, (req, res) => {
  Conversation.find({ patientId: req.user._id })
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
  req.body.conversation.patientId = req.user._id
  Conversation.create(req.body.conversation)
    .then(async (conversation) => {
      if (req.body.conversation.personMentions) {
        const mentions = req.body.conversation.personMentions

        mentions.forEach(async (mention) => {
          const existingInSameConvo = await PersonMentioned.findOne({
            conversationId: conversation._id,
            patientId: conversation.patientId,
            firstName: mention.firstName,
            lastName: mention.lastName
          })

          if (existingInSameConvo) return // Skip duplicate in same convo

          const existingAcrossConvos = await PersonMentioned.findOneAndUpdate(
            {
              patientId: conversation.patientId,
              firstName: mention.firstName,
              lastName: mention.lastName,
              conversationId: { $ne: conversation._id }
            },
            { $inc: { mentionCount: 1 } },
            { new: true }
          )

          if (existingAcrossConvos && existingAcrossConvos.mentionCount >= 2) {
            const sigExists = await SignificantPerson.findOne({
              patientId: conversation.patientId,
              firstName: mention.firstName,
              lastName: mention.lastName
            })

            if (!sigExists) {
              await SignificantPerson.create({
                patientId: conversation.patientId,
                firstName: mention.firstName,
                lastName: mention.lastName
              })
            }
          } else {
            await PersonMentioned.create({
              conversationId: conversation._id,
              patientId: conversation.patientId,
              firstName: mention.firstName,
              lastName: mention.lastName,
              context: mention.context || '',
              mentionCount: 1
            })
          }
        })
      }
      res.status(201).json({ conversation })
    })
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
