const express = require('express');
const Notification = require('../models/notificationModel');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/rloeMiddleware');

router.use(verifyToken);

router.post('/', authorizedRoles('admin'), async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;