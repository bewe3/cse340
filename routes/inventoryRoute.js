// Needed Resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities/');

// Route to build inventory by classification view
router.get('/type/:classificationId', invController.buildByClassificationId);

// Route for individual view
router.get('/detail/:inv_id', invController.getVehicleDetail);

// Route to deliver add new classification view
router.get('/add-classification', invController.renderAddClassificationView);

// Route for the management view
router.get('/', invController.renderManagementView);

// Route to deliver add new inventory view
router.get('/add-inventory', invController.renderAddInventoryView);

// Route to handle adding a new classification
router.post('/add-classification', invController.addNewClassification);

// Route to handle adding a new inventory
router.post('/add-inventory', invController.addNewInventory);

module.exports = router;
