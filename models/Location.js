const mongoose = require('mongoose');
const slug = require('slugs');

mongoose.Promise = global.Promise;

const locationSchema = new mongoose.Schema({
  // do stuff
  name: {
    type: String,
    trim: true,
    required: 'Please enter a location name!',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
});

locationSchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make slugs more resilient so that slugs are unique
});

module.exports = mongoose.model('Location', locationSchema);
