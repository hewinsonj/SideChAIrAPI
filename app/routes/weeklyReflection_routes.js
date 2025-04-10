const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const WeeklyReflection = require('../models/weeklyReflection')

// INDEX
router.get('/', requireToken, (req, res) => {
  WeeklyReflection.find({ owner: req.user._id })
    .then((reflections) => res.status(200).json({ reflections }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  WeeklyReflection.findById(req.params.id)
    .then(reflection => requireOwnership(req, reflection))
    .then((reflection) => res.status(200).json({ reflection }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.weeklyReflection.owner = req.user._id
  WeeklyReflection.create(req.body.weeklyReflection)
    .then((reflection) => res.status(201).json({ reflection }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  WeeklyReflection.findById(req.params.id)
    .then(reflection => requireOwnership(req, reflection))
    .then((reflection) => reflection.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
