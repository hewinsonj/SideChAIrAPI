const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const PersonMentioned = require('../models/personMentioned')

// INDEX
router.get('/', requireToken, (req, res) => {
  PersonMentioned.find({ owner: req.user._id })
    .then((people) => res.status(200).json({ people }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  PersonMentioned.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => res.status(200).json({ person }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.personMentioned.owner = req.user._id
  PersonMentioned.create(req.body.personMentioned)
    .then((person) => {
      const { firstname, lastname, patientId } = req.body.personMentioned
      PersonMentioned.countDocuments({ firstname, lastname, patientId })
        .then((count) => {
          if (count > 2) {
            const SignificantPerson = require('../models/significantPerson')
            return SignificantPerson.findOneAndUpdate(
              { firstname, lastname, patientId },
              {
                $setOnInsert: {
                  firstname,
                  lastname,
                  patientId,
                  relation: 'auto-detected',
                  supportPerson: false
                }
              },
              { upsert: true, new: true }
            )
          }
        })
      return person
    })
    .then((person) => res.status(201).json({ person }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  PersonMentioned.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => {
      Object.assign(person, req.body.personMentioned)
      return person.save()
    })
    .then((person) => res.status(200).json({ person }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  PersonMentioned.findById(req.params.id)
    .then(requireOwnership(req))
    .then((person) => {
      return person.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
