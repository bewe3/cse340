const pool = require('../database/');

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    'SELECT * FROM public.classification ORDER BY classification_name'
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error('getclassificationsbyid error ' + error);
  }
}

/* ***************************
 *  Get inventory item by id
 * ************************** */
async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      'SELECT * FROM public.inventory WHERE inv_id = $1',
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error('getVehicleById error ' + error);
  }
}

/* ***************************
 *  Insert new classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const data = await pool.query(
      'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *',
      [classification_name]
    );
    return data.rows[0];
  } catch (error) {
    console.error('insertClassification error ' + error);
    throw error;
  }
}

/* ***************************
 * Insert new inventory into the database
 * ************************** */
async function insertInventory(
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
) {
  console.log('insertInventory called');
  try {
    const data = await pool.query(
      'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        inv_make,
        inv_model,
        inv_year,
        inv_description || '',
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      ]
    );
    console.error('insertInventory result = ' + data);
    return data.rows[0];
  } catch (error) {
    console.error('insertInventory error ' + error);
    throw error;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *';
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    console.log('data: ', data);
    return data.rows[0];
  } catch (error) {
    console.error('model error: ' + error);
  }
}

async function removeInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    new Error('Delete Inventory Error');
  }
}

/* ***************************
 *  Search inventory by keyword
 * ************************** */
async function searchInventory(keyword) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE LOWER(i.inv_make) LIKE $1 
       OR LOWER(i.inv_model) LIKE $1 
       OR LOWER(i.inv_description) LIKE $1 
       OR LOWER(c.classification_name) LIKE $1`,
      [`%${keyword.toLowerCase()}%`]
    );
    return data.rows;
  } catch (error) {
    console.error('searchInventory error ' + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  insertClassification,
  insertInventory,
  updateInventory,
  removeInventory,
  searchInventory,
};
