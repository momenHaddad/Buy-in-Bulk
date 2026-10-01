const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    pricePerUnit: {
      type: Number,
      required: true
    },
    minOrderQuantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    picture: {
      type: String, 
      required: false 
    }
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Product', ProductSchema);