const express = require('express')
const router = express.Router()
const handle = require('../../lib/handle')
const requireToken = require('../../lib/requireToken')
const requireOwnership = require('../../lib/requireOwnership')

const Organization = require('../models/organization')

// INDEX
router.get('/', requireToken, (req, res) => {
  Organization.find({ owner: req.user._id })
    .then((orgs) => res.status(200).json({ orgs }))
    .catch((err) => handle(err, res))
})

// SHOW
router.get('/:id', requireToken, (req, res) => {
  Organization.findById(req.params.id)
    .then(requireOwnership(req))
    .then((org) => res.status(200).json({ org }))
    .catch((err) => handle(err, res))
})

// CREATE
router.post('/', requireToken, (req, res) => {
  req.body.organization.owner = req.user._id
  Organization.create(req.body.organization)
    .then((org) => res.status(201).json({ org }))
    .catch((err) => handle(err, res))
})

// UPDATE
router.patch('/:id', requireToken, (req, res) => {
  Organization.findById(req.params.id)
    .then(requireOwnership(req))
    .then((org) => {
      Object.assign(org, req.body.organization)
      return org.save()
    })
    .then((org) => res.status(200).json({ org }))
    .catch((err) => handle(err, res))
})

// DELETE
router.delete('/:id', requireToken, (req, res) => {
  Organization.findById(req.params.id)
    .then(requireOwnership(req))
    .then((org) => {
      return org.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch((err) => handle(err, res))
})

module.exports = router
