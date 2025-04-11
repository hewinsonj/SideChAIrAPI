const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')
const { filterLifeEventsByAccess } = require('../../lib/aiHelpers')

const LifeContext = require('../models/lifeContext')
const Conversation = require('../models/conversation')

// INDEX
router.get('/', requireToken, (req, res) => {
  LifeContext.find({ owner: req.user._id })
    .then((contexts) => res.status(200).json({ contexts }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  LifeContext.findById(req.params.id)
    .then(requireOwnership(req))
    .then((context) => res.status(200).json({ context }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.lifeContext.owner = req.user._id
  LifeContext.create(req.body.lifeContext)
    .then((context) => res.status(201).json({ context }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  LifeContext.findById(req.params.id)
    .then(requireOwnership(req))
    .then((context) => {
      Object.assign(context, req.body.lifeContext)
      return context.save()
    })
    .then((context) => res.status(200).json({ context }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  LifeContext.findById(req.params.id)
    .then(requireOwnership(req))
    .then((context) => context.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

router.post('/:id/sync-events', requireToken, async (req, res) => {
  try {
    const lifeContext = await LifeContext.findById(req.params.id)
    if (!lifeContext) return res.status(404).json({ error: 'LifeContext not found' })

    if (!lifeContext.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const conversations = await Conversation.find({ patientId: lifeContext.patient })
    const allEvents = conversations.flatMap(conv => conv.lifeEvents.map(event => ({
      ...event.toObject(),
      sourceConversation: conv._id,
      syncedAt: new Date()
    })))

    const existingTitles = new Set(lifeContext.lifeEvents.map(e => e.title))
    const newEvents = allEvents.filter(e => !existingTitles.has(e.title))

    lifeContext.lifeEvents.push(...newEvents)
    lifeContext.changeLog.push({
      updatedBy: req.user._id,
      note: `Synced ${newEvents.length} life event(s) from conversation(s).`
    })

    await lifeContext.save()
    res.status(200).json({ updatedContext: lifeContext })
  } catch (err) {
    handle(err, res)
  }
})

router.get('/patient/:patientId/life-events', requireToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ patientId: req.params.patientId })
    const allEvents = []

    conversations.forEach(conversation => {
      const visibleEvents = filterLifeEventsByAccess(req.user, conversation)
      visibleEvents.forEach(event => {
        allEvents.push({
          ...event,
          conversationId: conversation._id
        })
      })
    })

    res.status(200).json({ events: allEvents })
  } catch (err) {
    handle(err, res)
  }
})

router.post('/:id/life-events', requireToken, async (req, res) => {
  try {
    const lifeContext = await LifeContext.findById(req.params.id)
    if (!lifeContext) return res.status(404).json({ error: 'LifeContext not found' })

    if (!lifeContext.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const newEvent = req.body.lifeEvent
    newEvent.syncedAt = new Date()

    lifeContext.lifeEvents.push(newEvent)
    lifeContext.changeLog.push({
      updatedBy: req.user._id,
      note: `Manually added life event: ${newEvent.title}`
    })

    await lifeContext.save()
    res.status(201).json({ added: newEvent })
  } catch (err) {
    handle(err, res)
  }
})

router.get('/patient/:patientId/life-events/filter', requireToken, async (req, res) => {
  try {
    const { category, importance, startDate, endDate } = req.query

    const conversations = await Conversation.find({ patientId: req.params.patientId })
    const filtered = []

    conversations.forEach(conversation => {
      const visibleEvents = filterLifeEventsByAccess(req.user, conversation)
      visibleEvents.forEach(event => {
        const matchesCategory = category ? event.category === category : true
        const matchesImportance = importance ? event.importance === importance : true
        const flagged = new Date(event.flaggedAt)
        const matchesDate =
          (!startDate || flagged >= new Date(startDate)) &&
          (!endDate || flagged <= new Date(endDate))

        if (matchesCategory && matchesImportance && matchesDate) {
          filtered.push({
            ...event,
            conversationId: conversation._id
          })
        }
      })
    })

    res.status(200).json({ events: filtered })
  } catch (err) {
    handle(err, res)
  }
})

router.patch('/:id/life-events/:eventIndex', requireToken, async (req, res) => {
  try {
    const lifeContext = await LifeContext.findById(req.params.id)
    if (!lifeContext) return res.status(404).json({ error: 'LifeContext not found' })

    if (!lifeContext.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const index = parseInt(req.params.eventIndex)
    if (isNaN(index) || !lifeContext.lifeEvents[index]) {
      return res.status(404).json({ error: 'Life event not found' })
    }

    Object.assign(lifeContext.lifeEvents[index], req.body.lifeEvent)
    lifeContext.changeLog.push({
      updatedBy: req.user._id,
      note: `Updated life event: ${lifeContext.lifeEvents[index].title}`
    })

    await lifeContext.save()
    res.status(200).json({ updated: lifeContext.lifeEvents[index] })
  } catch (err) {
    handle(err, res)
  }
})

router.delete('/:id/life-events/:eventIndex', requireToken, async (req, res) => {
  try {
    const lifeContext = await LifeContext.findById(req.params.id)
    if (!lifeContext) return res.status(404).json({ error: 'LifeContext not found' })

    if (!lifeContext.owner.equals(req.user._id)) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    const index = parseInt(req.params.eventIndex)
    if (isNaN(index) || !lifeContext.lifeEvents[index]) {
      return res.status(404).json({ error: 'Life event not found' })
    }

    const removed = lifeContext.lifeEvents.splice(index, 1)
    lifeContext.changeLog.push({
      updatedBy: req.user._id,
      note: `Deleted life event: ${removed[0].title}`
    })

    await lifeContext.save()
    res.status(200).json({ deleted: removed[0] })
  } catch (err) {
    handle(err, res)
  }
})

module.exports = router
