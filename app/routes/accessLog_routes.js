const express = require('express');
const router = express.Router();
const AccessLog = require('../models/accessLog');
const requireToken = require('../../lib/requireToken');
const handle = require('../../lib/handle');

// INDEX - Get access logs for current user (therapist)
router.get('/', requireToken, (req, res) => {
  AccessLog.find({ userId: req.user._id })
    .sort({ timestamp: -1 })
    .then((logs) => res.status(200).json({ logs }))
    .catch((err) => handle(err, res));
});

// CREATE - Log therapist access
router.post('/', requireToken, (req, res) => {
  const log = {
    userId: req.user._id,
    patientId: req.body.patientId,
    conversationId: req.body.conversationId,
    action: req.body.action
  };
  AccessLog.create(log)
    .then((entry) => res.status(201).json({ entry }))
    .catch((err) => handle(err, res));
});

module.exports = router;
