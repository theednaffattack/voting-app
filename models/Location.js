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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
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
};

locationSchema.statics.getTopLocations = function () {
  return this.aggregate([
    // lookup locations and populate their reviews
    { $lookup: {
      from: 'reviews', // confusing. Mongo lowercases and puts an 's' on the end of your model FOR YOU
      localField: '_id', // which field on the location (THIS model)
      foreignField: 'location', // which field on the review? (it's actually pretty simple...)
      as: 'reviews' } // what the field is going to be called
    }, // filter for only items that have 2 or more reviews
    {
      $match: { 'reviews.1': { $exists: true } }
    },
    
    // add the average reviews field
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      reviews: '$$ROOT.reviews',
      slug: '$$ROOT.slug',
      averageRating: { $avg: '$reviews.rating' }
    } },
    // sort it by our new field, highest reviews first
    { $sort: { averageRating: -1 } },
    // limit to at most 10 items
    { $limit: 10 }
  ]);
};

locationSchema.virtual('reviews', {
  ref: 'Review', // which model to link?
  localField: '_id', // which field on the location (THIS model)
  foreignField: 'location' // which field on the review? (it's actually pretty simple...)
});

module.exports = mongoose.model('Location', locationSchema);
