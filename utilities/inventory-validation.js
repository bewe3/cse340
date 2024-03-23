const { body, validationResult } = require('express-validator');
const inventoryModel = require('../models/inventory-model');

const validate = {};

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body('inv_make')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Make is required.'),

    body('inv_model')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Model is required.'),

    body('inv_image')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Image URL is required.'),

    body('inv_thumbnail')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Thumbnail URL is required.'),

    body('inv_price').trim().isNumeric().withMessage('Price is required.'),

    body('inv_year').trim().isNumeric().withMessage('Year is required.'),

    body('inv_miles').trim().isNumeric().withMessage('Miles is required.'),

    body('inv_color')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Color is required.'),

    body('inv_description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description is required.'),
  ];
};

/* ******************************
 * Check data and return errors or continue to inventory addition
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

/* ******************************
 * Check update data and return errors
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_description,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('inventory/edit', {
      errors,
      title: 'Edit Inventory',
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_description,
    });
    return;
  }
  next();
};


module.exports = validate;
