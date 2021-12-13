const mongoose = require('mongoose');

const ItemPriceSchema = new mongoose.Schema({
  createdDttm: {
    type: String,
  },
  itemName: {
      type: String
  },
  itemPrice: {
      type: String
  }
});

module.exports = mongoose.model('ItemPriceData', ItemPriceSchema);
