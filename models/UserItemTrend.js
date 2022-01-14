const mongoose = require("mongoose");

const UserInterestedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  interestedItemsArray: {
    type: [String],
  },
});

module.exports = mongoose.model("UserInterested", UserInterestedSchema);
