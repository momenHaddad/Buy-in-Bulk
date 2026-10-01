const express = require('express');
const Order = require('../models/orderModel');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/rloeMiddleware');

router.use(verifyToken);

router.get('/open/:productId', async (req, res) => {
  try {
    const order = await Order.findOne({
      productId: req.params.productId,
      status: 'Not requested'
    }).sort({ createdAt: -1 });

    if (!order) {
      return res.json(null);
    }

    res.json({
      _id: order._id,
      productId: order.productId,
      totalQuantity: order.totalQuantity,
      status: order.status,
      participantCount: order.participants.length,
      joinedByCurrentUser: order.participants.some(
        (participant) => participant.userId.toString() === req.user.id
      )
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const quantityRequested = Number(req.body.quantityRequested);
    if (!req.body.productId || !Number.isFinite(quantityRequested) || quantityRequested <= 0) {
      return res.status(400).json({ message: 'A product and positive quantity are required' });
    }

    const newOrder = new Order({
      productId: req.body.productId,
      totalQuantity: quantityRequested,
      participants: [{
        userId: req.user.id,
        quantityRequested,
        name: req.user.name
      }]
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Users can only see orders they participate in; admins can see all orders.
router.get('/', async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { 'participants.userId': req.user.id };
    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get an order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status !== 'Not requested') {
      return res.status(409).json({ message: 'This order is no longer open' });
    }

    const quantityRequested = Number(req.body.quantityRequested);
    if (!Number.isFinite(quantityRequested) || quantityRequested <= 0) {
      return res.status(400).json({ message: 'A positive quantity is required' });
    }

    const participant = order.participants.find(
      (entry) => entry.userId.toString() === req.user.id
    );
    if (participant) {
      participant.quantityRequested = quantityRequested;
    } else {
      order.participants.push({
        userId: req.user.id,
        quantityRequested,
        name: req.user.name
      });
    }
    order.totalQuantity = order.participants.reduce(
      (total, entry) => total + entry.quantityRequested,
      0
    );
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Only admins may change order status.
router.patch('/:id', authorizedRoles('admin'), async (req, res) => {
  try {
    const allowedStatuses = ['Not requested', 'confirmed', 'shipped', 'delivered'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'A valid order status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete('/:id', authorizedRoles('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
