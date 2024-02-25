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

module.exports = invCont;
