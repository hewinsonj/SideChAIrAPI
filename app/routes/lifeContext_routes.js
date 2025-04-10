const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const LifeContext = require('../models/lifeContext')

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

module.exports = router
