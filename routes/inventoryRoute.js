// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get(
  '/type/:classificationId',
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route for individual view
router.get(
  '/detail/:inv_id',
  utilities.handleErrors(invController.getVehicleDetail)
);

// Route to deliver add new classification view
router.get(
  '/add-classification',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.renderAddClassificationView)
);

// Route for the management view
router.get('/', utilities.handleErrors(invController.renderManagementView));

// Route for editing inventory
router.get(
  '/edit/:inv_id',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.editInventoryView)
);

// Route to deliver add new inventory view
router.get(
  '/add-inventory',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.renderAddInventoryView)
);

// Route to process JSON
router.get(
  '/getInventory/:classification_id',
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to handle adding a new classification
router.post(
  '/add-classification',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.addNewClassification)
);

// Route to handle updating inventory
router.post(
  '/update',
  utilities.checkLogin,
  utilities.checkClearance,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to handle adding a new inventory
router.post(
  '/add-inventory',
  utilities.checkLogin,
  utilities.checkClearance,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addNewInventory)
);

// Routes to handle deleting
router.get(
  '/delete-confirm/:inv_id',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.deleteInventory)
);

router.post(
  '/delete-confirm/',
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(invController.removeInventory)
);

// Route to search inventory
router.get('/search', (req, res) => {
  console.log('Search request received');
  utilities.handleErrors(invController.searchInventory)(req, res);
});


module.exports = router;
