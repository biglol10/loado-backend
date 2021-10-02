const mongoose = require('mongoose');

const LoadoLogsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  activity: {
    type: String,
    required: true,
  },
  stringParam: {
    type: String,
  },
  createdDttm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LoadoLogs', LoadoLogsSchema);
