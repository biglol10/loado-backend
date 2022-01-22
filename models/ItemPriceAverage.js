const mongoose = require("mongoose");

const ItemPriceAverageSchema = new mongoose.Schema({
  createdDttm: {
    type: String,
  },
  itemName: {
    type: String,
  },
  itemPriceAverage: {
    type: Number,
  },
});

module.exports = mongoose.model("ItemPriceAverage", ItemPriceAverageSchema);
