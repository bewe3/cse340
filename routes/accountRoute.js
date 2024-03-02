// Needed Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

// Route for the "My Account" link
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);

// Process the registration data
router.post(
  '/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Export the router for use elsewhere
module.exports = router;
