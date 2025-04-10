const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const Keyword = require('../models/keyword')

// INDEX
router.get('/', requireToken, (req, res) => {
  Keyword.find({ owner: req.user._id })
    .then((keywords) => res.status(200).json({ keywords }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  Keyword.findById(req.params.id)
    .then(requireOwnership(req))
    .then((keyword) => res.status(200).json({ keyword }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.keyword.owner = req.user._id
  Keyword.create(req.body.keyword)
    .then((keyword) => res.status(201).json({ keyword }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  Keyword.findById(req.params.id)
    .then(requireOwnership(req))
    .then((keyword) => {
      Object.assign(keyword, req.body.keyword)
      return keyword.save()
    })
    .then((keyword) => res.status(200).json({ keyword }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  Keyword.findById(req.params.id)
    .then(requireOwnership(req))
    .then((keyword) => keyword.deleteOne())
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
