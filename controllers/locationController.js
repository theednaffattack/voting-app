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
  console.log(locations);
  res.render('locations', { title: 'Locations', locations });
};

exports.reverse = (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
};
