const express = require('express');
const router = express.Router();
const Util = require('../utilities'); // Add this line to require the Util object
const errorController = require('../controllers/errorController');

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static('public'));

router.use('/css', express.static(__dirname + 'public/css'));
router.use('/js', express.static(__dirname + 'public/js'));
router.use('/images', express.static(__dirname + 'public/images'));

// Error route
router.get('/trigger-error', Util.handleErrors(errorController.triggerError));

module.exports = router;
