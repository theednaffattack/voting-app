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
router.post('/add', catchErrors(locationController.createLocation));

// A dummy route that reverses the next param
router.get('/reverse/:name', locationController.reverse);

module.exports = router;
