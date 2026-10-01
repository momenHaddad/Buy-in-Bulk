const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        
        quantityRequested: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          ref: 'User',
          required: true
        }
      }
    ],
    status: {
      type: String,
      enum: ['Not requested', 'confirmed', 'shipped', 'delivered'],
      default: 'Not requested'
    }
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Order', OrderSchema);