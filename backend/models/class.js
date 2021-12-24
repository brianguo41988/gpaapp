const mongoose = require('mongoose');
const { stringify } = require('querystring');

const classSchema = mongoose.Schema({
  className: { type: String, required: true },
  classWeight: { type: String, required: true},
  classDes: { type: String, required: true},
  imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Class', classSchema);
