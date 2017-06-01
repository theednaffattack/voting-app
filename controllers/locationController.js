const mongoose = require('mongoose');

const Location = mongoose.model('Location');

exports.homePage = (req, res) => {
  res.render('homepage');
};

exports.addLocation = (req, res) => {
  res.render('editLocation', { title: 'Add Location' });
};

exports.createLocation = async (req, res) => {
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

exports.editLocation = async (req, res) => {
  // 1. Find the store given the ID
  const location = await Location.findOne({ _id: req.params.id });
  // 2. TODO confirm they are the owner of the store
  // 3. Render out the edit form so the user can update their store
  res.render('editLocation', { title: `Edit ${location.name}`, location });
};

exports.updateLocation = async (req, res) => {
  // find and update the store
  const location = await Location.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new (updated) location instead of the old one
    runValidators: true,
  }).exec();
  req.flash('success', `Successfully updated <strong>${location.name}</strong>. <a href="/location/${location.slug}">View Location →</a>`);
  // redirect them to the store and tell them it works
  res.redirect(`/locations/${location._id}/edit`);
};

exports.reverse = (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
};
