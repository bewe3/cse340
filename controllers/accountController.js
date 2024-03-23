// Required Resources
const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/login', {
    title: 'Login',
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render('account/register', {
    title: 'Register',
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  console.log('Registering account...');
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      'notice',
      'Sorry, there was an error processing the registration.'
    );
    res.status(500).render('account/register', {
      title: 'Registration',
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      'notice',
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render('account/login', {
      title: 'Login',
      nav,
    });
  } else {
    req.flash('notice', 'Sorry, the registration failed.');
    res.status(501).render('account/register', {
      title: 'Registration',
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  try {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    console.log('gotten account by email: ', accountData);
    if (!accountData) {
      req.flash('notice', 'Please check your credentials and try again.');
      return res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    console.log('account_password:', account_password);
    console.log('account_password:', accountData.account_password);
    if (!passwordMatch) {
      req.flash('notice', 'Please check your credentials and try again.');
      return res.status(400).render('account/login', {
        title: 'Login',
        nav,
        errors: null,
        account_email,
      });
    }

    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    });
    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600 * 1000,
    };
    if (process.env.NODE_ENV === 'development') {
      cookieOptions.secure = true;
    }
    res.cookie('jwt', accessToken, cookieOptions);
    return res.redirect('/account/');
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send('Internal Server Error');
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
const accountManagementView = async (req, res) => {
  try {
    let nav = await utilities.getNav();
    const email = req.session.email;
    const account = await accountModel.getAccountByEmail(email);
    res.render('account/account-management', {
      title: 'Account Management',
      nav,
      account,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while fetching account data.');
    res.redirect('/');
  }
};

/* ****************************************
 *  Deliver account update view
 * ************************************ */
async function accountUpdateView(req, res) {
  console.log('accountUpdateView called');
  let nav = await utilities.getNav();
  const { account_id } = req.params;
  console.log('account_id: ', account_id);
  const data = await accountModel.getAccountById(account_id);
  console.log('data: ', data);
  res.render('account/update-account', {
    title: 'Edit Account',
    nav,
    flash: req.flash(),
    errors: null,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
  });
}

/* ****************************************
 * Update account
 * ************************************ */
async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let nav = await utilities.getNav();
  console.log('Update request received with:', req.body);
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );
  console.log('Update result:', updateResult);
  if (updateResult) {
    const updatedName = account_firstname + ' ' + account_lastname;

    const accountData = await accountModel.getAccountById(account_id);
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600 * 1000,
    });
    res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    req.flash('notice', `${updatedName}'s account was successfully updated.`);
    res.redirect('/');
  } else {
    req.flash('notice', 'Sorry, the update failed.');
    res.status(501).render('account/account-management', {
      title: 'Edit Account',
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 * Change password
 * ************************************ */
async function changePassword(req, res) {
  console.log('changePassword function called');
  let nav = await utilities.getNav();
  const { new_password, account_id } = req.body;
  console.log('New password:', new_password);
  console.log('Account ID:', account_id);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(new_password, 10);
    console.log('Hashed password:', hashedPassword);
    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    );
    console.log('Update result:', updateResult);
    if (updateResult) {
      const updatedName =
        updateResult.account_firstname + ' ' + updateResult.account_lastname;
      req.flash(
        'notice',
        `${updatedName}'s password was successfully updated.`
      );
      res.redirect('/account');
    } else {
      req.flash('notice', 'Sorry, the password update failed.');
      res.status(501).render('account/update-account', {
        title: 'Edit Account',
        nav,
        flash: req.flash(),
        errors: null,
        account_id,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash('notice', 'Sorry, there was an error changing your password.');
    res.status(500).render('account/update-account', {
      title: 'Edit Account',
      nav,
      errors: null,
      account_id,
    });
  }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function accountLogout(req, res) {
  let nav = await utilities.getNav();
  req.flash('notice', 'Successfully logged out.');
  res.clearCookie('jwt');
  return res.redirect('/');
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagementView,
  changePassword,
  updateAccount,
  accountUpdateView,
  accountLogout,
};
