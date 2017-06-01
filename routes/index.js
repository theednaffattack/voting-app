const express = require('express');
const locationController = require('../controllers/locationController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

// Ye olde entry point
// router.get('/', locationController.homePage);

// list locations
router.get('/', locationController.getLocations);
router.get('/locations', locationController.getLocations);

// edit locations
router.get('/add', catchErrors(locationController.addLocation));

// add locations
router.post('/add',
  locationController.upload, // read the file into memory
  catchErrors(locationController.resize), // resize & save to disk
  catchErrors(locationController.createLocation)); // create location

// add locations
router.post('/add/:id',
  locationController.upload, // read the file into memory
  catchErrors(locationController.resize), // resize & save to disk
  catchErrors(locationController.updateLocation));

router.get('/location/:slug', catchErrors(locationController.getLocationBySlug));

// edit location
router.get('/locations/:id/edit', catchErrors(locationController.editLocation));

// * A dummy route that reverses the next param
router.get('/reverse/:name', locationController.reverse);

module.exports = router;
