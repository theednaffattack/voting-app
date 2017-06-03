const mongoose = require('mongoose');
const slug = require('slugs');

mongoose.Promise = global.Promise;

const locationSchema = new mongoose.Schema({
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
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    address: {
      type: String,
      trim: true,
      required: 'You must enter an address!',
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!',
    }],
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});

locationSchema.index({
  name: 'text',
  description: 'text'
});

locationSchema.index({ location: '2dsphere' });

locationSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);

  // find other locations that have a slug of eddie, eddie-1, eddie-2, etc.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)`, 'i');
  const locationsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (locationsWithSlug.length) {
    this.slug = `${this.slug}-${locationsWithSlug.length + 1}`;
  }

  next();
});

locationSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
}

module.exports = mongoose.model('Location', locationSchema);
