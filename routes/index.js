const express = require('express');
const storeController = require('../controllers/storeController');

const router = express.Router();

// Do work here
router.get('/', storeController.homePage);

// A dummy route that reverses the next param
router.get('/reverse/:name', storeController.reverse);

module.exports = router;
