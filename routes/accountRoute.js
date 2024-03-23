// Needed Resources
const express = require('express');
const router = new express.Router();
const utilities = require('../utilities/index');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');

// Routes for the "My Account" link
router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegister);

// Route default for accounts
router.get('/', utilities.checkLogin, accountController.accountManagementView);

// Route for login process
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the registration data
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to deliver the account update view
router.get(
  '/update-account/:account_id',
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountUpdateView)
);

// Route to handle the account update process
router.post(
  '/update-account/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to handle the password change process
router.post(
  '/update-password/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.changePassword)
);

router.get('/logout', utilities.handleErrors(accountController.accountLogout));

// Export the router for use elsewhere
module.exports = router;
