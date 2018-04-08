const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  userID: { type: 'String', required: true },
  userAction: { type: 'String', required: true },
  actionTime: { type: 'Date', default: Date.now, required: true },
});

module.exports = mongoose.model('Log', logSchema);
