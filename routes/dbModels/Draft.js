const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
  name: { type: 'String', required: true },
  email: { type: 'String', required: true },
  organisation: { type: 'String', required: true },
  title: { type: 'String', required: true },
  description: { type: 'String', required: true },
  members: { type: 'String', required: false },
  heardFrom: { type: 'String', required: true },
  fileName: { type: 'String', required: false },
  fileData: { type: 'String', required: false },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', default: Date.now, required: true },
  checkedMailSent: { type: 'Bool', default: false, required: true },
});

module.exports = mongoose.model('Draft', draftSchema);
