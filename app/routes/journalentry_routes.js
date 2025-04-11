const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const JournalEntry = require('../models/journalEntry')
router.get('/ping-test', (req, res) => {
  console.log('💥💥💥 journalEntry PING route hit 💥💥💥')
  res.status(200).json({ message: 'journalEntry PING route hit' })
})
// const requireOwnership = require('../../lib/requireOwnership')

console.log('JournalEntry routes loaded')

// INDEX
router.get('/', requireToken, (req, res) => {
  JournalEntry.find({ owner: req.user._id })
    .then((entries) => {
      const populated = entries.map(entry => ({
        ...entry.toObject({ virtuals: true })
      }))
      res.status(200).json({ entries: populated })
    })
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  console.log('JournalEntry get route HIT')
  JournalEntry.findById(req.params.id)
    // .then(requireOwnership(req))
    .then((entry) => res.status(200).json({ entry: entry.toObject({ virtuals: true }) }))
    .catch((err) => handle(err, res))
})

router.post('/', requireToken, (req, res) => {
  console.log('🎯 POST /journal-entries hit')
  if (!req.body.journalEntry) {
    return res.status(400).json({ error: 'Missing journalEntry data' })
  }
  const entryData = req.body.journalEntry
  entryData.owner = req.user._id
  if (!entryData.tags) entryData.tags = []

  const relatedRefs = Object.keys(entryData).filter(key => key.startsWith('related') && entryData[key])
  if (relatedRefs.length > 0) {
    console.log('Creating journal entry with linked references:', relatedRefs.reduce((obj, key) => {
      obj[key] = entryData[key]
      return obj
    }, {}))
  }

  JournalEntry.create(entryData)
    .then((entry) => res.status(201).json({ entry }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  JournalEntry.findById(req.params.id)
    // .then(requireOwnership(req))
    .then((entry) => {
      Object.assign(entry, req.body.journalEntry)
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

// FILTER — GET /filter
router.get('/filter', requireToken, async (req, res) => {
  const { tag, regular, ...relatedFilters } = req.query

  const filter = { owner: req.user._id }

  if (tag) {
    filter.tags = tag
  }

  if (regular === 'true') {
    filter.$and = [
      { relatedTreatment: { $exists: false } },
      { relatedTherapistRating: { $exists: false } },
      { relatedTherapist: { $exists: false } },
      { relatedWeeklyReflection: { $exists: false } },
      { relatedSupportPerson: { $exists: false } },
      { relatedSessionNote: { $exists: false } },
      { relatedOrganization: { $exists: false } },
      { relatedLifeContext: { $exists: false } },
      { relatedFlaggedSession: { $exists: false } },
      { relatedExportLog: { $exists: false } },
      { relatedConversation: { $exists: false } },
      { relatedAITheme: { $exists: false } },
      { relatedAIScoring: { $exists: false } },
      { relatedAISummary: { $exists: false } },
      { relatedAccessLog: { $exists: false } },
      { relatedPatientRating: { $exists: false } }
    ]
  }

  // Include any specific related fields passed (e.g. ?relatedTreatment=ID)
  Object.entries(relatedFilters).forEach(([key, value]) => {
    if (key.startsWith('related') && value) {
      filter[key] = value
    }
  })

  try {
    const entries = await JournalEntry.find(filter)
    const populated = entries.map(entry => entry.toObject({ virtuals: true }))
    res.status(200).json({ entries: populated })
  } catch (err) {
    handle(err, res)
  }
})

module.exports = router
