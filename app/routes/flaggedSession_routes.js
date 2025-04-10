const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')

const FlaggedSession = require('../models/flaggedSession')

// INDEX
router.get('/', requireToken, (req, res) => {
  FlaggedSession.find({ flaggedBy: req.user._id })
    .then((flags) => res.status(200).json({ flags }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  FlaggedSession.findById(req.params.id)
    .then((flag) => {
      if (!flag || !flag.flaggedBy.equals(req.user._id)) {
        return res.sendStatus(404)
      }
      res.status(200).json({ flag })
    })
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.flaggedSession.flaggedBy = req.user._id
  FlaggedSession.create(req.body.flaggedSession)
    .then((flag) => res.status(201).json({ flag }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  FlaggedSession.findById(req.params.id)
    .then((flag) => {
      if (!flag || !flag.flaggedBy.equals(req.user._id)) {
        return res.sendStatus(404)
      }
      return flag.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
