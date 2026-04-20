const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  isAvailable: Boolean
});

const Rooms = mongoose.model('Rooms', roomSchema);
module.exports = Rooms;