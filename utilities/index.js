const invModel = require('../models/inventory-model');
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul>';
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      console.log(vehicle.inv_thumbnail);
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        ' ' +
        vehicle.inv_model +
        '</a>';
      grid += '</h2>';
      grid +=
        '<span>$' +
        new Intl.NumberFormat('en-US').format(vehicle.inv_price) +
        '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the vehicle details view HTML
 * ************************************ */
Util.buildVehicleDetail = function (vehicle) {
  let html = `<div class="vehicle-detail-container">`;
  html += `<div class="vehicle-detail-image">`;
  html += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" />`;
  html += `</div>`;
  html += `<div class="vehicle-detail-info">`;
  html += `<h2>$${new Intl.NumberFormat('en-US').format(
    vehicle.inv_price
  )}</h2>`;
  html += `<p>${vehicle.inv_description}</p>`;
  html += `<ul>`;
  html += `<li><strong>Year:</strong> ${vehicle.inv_year}</li>`;
  html += `<li><strong>Mileage:</strong> ${new Intl.NumberFormat(
    'en-US'
  ).format(vehicle.inv_miles)}</li>`;
  html += `<li><strong>Color:</strong> ${vehicle.inv_color}</li>`;
  html += `</ul>`;
  html += `</div>`;
  html += `</div>`;
  return html;
};

/* **************************************
 * Build classification dropdown options
 * ************************************ */
Util.buildClassificationDropdown = async function () {
  let classifications = await invModel.getClassifications();
  let dropdownOptions = '';
  classifications.rows.forEach((classification) => {
    dropdownOptions += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
  });
  return dropdownOptions;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
