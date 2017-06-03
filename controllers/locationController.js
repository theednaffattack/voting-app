const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const Location = mongoose.model('Location');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That fieldtype isn\'t allowed!' }, false);
    }
  },
};

exports.homePage = (req, res) => {
  res.render('homepage');
};

exports.addLocation = (req, res) => {
  res.render('editLocation', { title: 'Add Location' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // chieck if there is no file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now to resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to file, keep going
  next();
};

exports.createLocation = async (req, res) => {
  req.body.author = req.user._id;
  const location = new Location(req.body);
  await location.save();
  req.flash('success', `Successfully added <strong>${location.name}!</strong>`);
  res.redirect(`/location/${location.slug}`);
};

exports.getLocations = async (req, res) => {
  // 1. Query the database for a list of all locations
  const locations = await Location.find();
  res.render('locations', { title: 'Locations', locations });
};

const confirmOwner = (location, user) => {
  if (!location.author.equals(user._id)) {
    throw Error('You must own a location in order to edit!');
  }
};

exports.editLocation = async (req, res) => {
  // 1. Find the store given the ID
  const location = await Location.findOne({ _id: req.params.id });
  // 2. TODO confirm they are the owner of the store
  confirmOwner(location, req.user);
  // 3. Render out the edit form so the user can update their store
  res.render('editLocation', { title: `Edit ${location.name}`, location });
};

exports.updateLocation = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point';
  // find and update the store
  const location = await Location.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new (updated) location instead of the old one
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated <strong>${location.name}</strong>. <a href="/location/${location.slug}">View Location →</a>`);
  // redirect them to the store and tell them it works
  res.redirect(`/locations/${location._id}/edit`);
};

exports.getLocationBySlug = async (req, res, next) => {
  const location = await Location.findOne({ slug: req.params.slug }).populate('author');
  if (!location) return next();
  res.render('location', { location, title: location.name });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Location.getTagsList();
  const locationsPromise = Location.find({ tags: tagQuery });
  const [tags, locations] = await Promise.all([tagsPromise, locationsPromise]);
  // res.json(result);
  res.render('tag', { tags, title: 'Tags', tag, locations });
};

exports.searchLocations = async (req, res) => {
  const locations = await Location
  // first find stores that match
  .find({
    $text: {
      $search: req.query.q
    }
  }, {
    score: { $meta: 'textScore' }
  })
  // then sort them
  .sort({
    score: { $meta: 'textScore' }
  }).limit(5);
  res.json(locations);
};

exports.mapStores = async (req, res) => {
  // res.json({ it: 'worked' }); // test the route's functionality

  // 1) take the request coordinates and create an array of lat and lng
  // 2) map over the array and convert the two strings as numbers
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);

  // construct our mongo query
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000 // 10km
      }
    }
  };
  // use mongo's 'select' method to choose (and restrict) what comes back
  const locations = await Location.find(query).select('description location name slug').limit(10);
  res.json(locations);
};

exports.reverse = (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
};
