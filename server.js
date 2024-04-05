/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require('express');
const env = require('dotenv').config();
const app = express();
const static = require('./routes/static');
const expressLayouts = require('express-ejs-layouts');
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const utilities = require('./utilities/');
const session = require('express-session');
const pool = require('./database/');
const accountRoute = require('./routes/accountRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })
);

// Cookie Parser
app.use(cookieParser());

// Middleware for JWT
app.use(utilities.checkJWTToken);

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  console.log('Request received:', req.url);
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layouts/layout'); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(express.static('public')); //changed to serve static files from public folder

// Index route
app.get('/', utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use('/inv', inventoryRoute);

// Account route
app.use('/account', accountRoute);

// intentional error
app.get(
  '/trigger-error',
  utilities.handleErrors((req, res, next) => {
    next(new Error('This is an intentional error'));
  })
);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: 'Not quite my tempo.',
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  let message;
  if (err.status == 404) {
    message = err.message;
  } else if (err.status && err.status !== 201) {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.status(err.status || 500).render('errors/error', {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
