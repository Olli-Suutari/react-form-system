const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
  infoFi: { type: 'String', required: true },
  infoEn: { type: 'String', required: true },
  emailInfoFi: { type: 'String', required: true },
  emailInfoEn: { type: 'String', required: true },
  termsFi: { type: 'String', required: true },
  termsEn: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
});

module.exports = mongoose.model('Info', infoSchema);
