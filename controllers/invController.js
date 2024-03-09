const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render('./inventory/classification', {
    title: className + ' vehicles',
    nav,
    grid,
  });
};

/*
 * Build cars
 */

invCont.getVehicleDetail = async function (req, res, next) {
  const vehicle_id = req.params.inv_id;
  const vehicle = await invModel.getVehicleById(vehicle_id);
  const html = await utilities.buildVehicleDetail(vehicle);
  let nav = await utilities.getNav();
  res.render('./inventory/vehicle_detail', {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleHtml: html,
  });
};

/*
 * Render management view
 */
invCont.renderManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/management', {
    title: 'Inventory Management',
    message: 'Welcome to the Inventory Management Page',
    nav,
  });
};

/*
 * Render add new classification view
 */
invCont.renderAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add New Classification',
    nav,
  });
};

/*
 * Render add new inventory view
 */
invCont.renderAddInventoryView = async function (req, res, next) {
  const dropdownOptions = await utilities.buildClassificationDropdown();
  let nav = await utilities.getNav();
  res.render('./inventory/add-inventory', {
    title: 'Add New Inventory',
    nav,
    dropdownOptions,
  });
};

/*
 * Add new classification
 */
invCont.addNewClassification = async function (req, res, next) {
  const { classificationName } = req.body;
  let nav = await utilities.getNav();
  console.log('addNewClassification called');
  if (!/^[a-zA-Z]+$/.test(classificationName)) {
    console.log('Regex');
    req.flash(
      'error',
      'Classification name should only contain letters and cannot be empty.'
    );
    return res.redirect('/inv/add-classification');
  }
  try {
    await invModel.insertClassification(classificationName);
    req.flash('success', 'New classification added successfully.');
    res.redirect('/inv');
    console.log('Try, catch:');
  } catch (err) {
    console.error(err);
    console.log('Error:', err);
    req.flash('error', 'Failed to add new classification.');
    res.redirect('/inv/add-classification');
  }
};

/*
 * Add new inventory
 */

invCont.addNewInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const placeholders = {
    inv_make: 'Minimum 3 characters',
    inv_model: 'Minimum 3 characters',
    inv_year: '4 digits',
    inv_description: 'Optional Description',
    inv_image: 'Start with "/images/vehicles/"',
    inv_thumbnail: 'Start with "/images/vehicles/"',
    inv_price: 'Decimal or integer only',
    inv_miles: 'Digits only',
    inv_color: 'Letters only',
  };

  const errors = {};
  if (inv_make.length < 3)
    errors.inv_make = 'Make must be at least 3 characters';
  if (inv_model.length < 3)
    errors.inv_model = 'Model must be at least 3 characters';
  if (inv_image.indexOf('/images/vehicles/') !== 0)
    errors.inv_image = 'Image path must start with "/images/vehicles/"';
  if (inv_thumbnail.indexOf('/images/vehicles/') !== 0)
    errors.inv_thumbnail = 'Thumbnail path must start with "/images/vehicles/"';
  if (!/^\d+$/.test(inv_miles)) errors.inv_miles = 'Miles must be digits only';
  if (!/^\d{4}$/.test(inv_year)) errors.inv_year = 'Year must be 4 digits';
  if (!/^\d+(\.\d+)?$/.test(inv_price))
    errors.inv_price = 'Price must be decimal or integer only';
  if (!/^[a-zA-Z]+$/.test(inv_color))
    errors.inv_color = 'Color must be letters only';

  if (Object.keys(errors).length > 0) {
    let nav = await utilities.getNav();
    res.render('./inventory/add-inventory', {
      title: 'Add New Inventory',
      nav,
      placeholders,
      errors,
    });
    return;
  }

  try {
    await invModel.insertInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );
    req.flash('success', 'New inventory added successfully.');
    res.redirect('/inv');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to add new inventory.');
    res.redirect('/inv/add-inventory');
  }
};

module.exports = invCont;
