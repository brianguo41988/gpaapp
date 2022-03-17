const mongoose = require('mongoose');
const { stringify } = require('querystring');

const classSchema = mongoose.Schema({
  className: { type: String, required: true },
  classWeight: { type: String, required: true},
  classDes: { type: String, required: true},
  notes: { type: String, required: false},
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // ref: reference used for User
});

module.exports = mongoose.model('Class', classSchema);
