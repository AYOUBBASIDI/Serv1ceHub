const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
  title: String,
  description: String,
  color1: String,
  color2: String,
  icon: String,
  iconAlt: String,
  link: String,
});

module.exports = mongoose.model('services',servicesSchema);


