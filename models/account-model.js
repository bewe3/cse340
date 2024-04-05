const pool = require('../database/index');
const bcrypt = require('bcryptjs');

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    console.log(
      'Received data:',
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error('No matching email found');
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = 'SELECT * FROM account WHERE account_email = $1';
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 * Get account by ID
 * ********************* */
async function getAccountById(account_id) {
  try {
    console.log('getAccountById called', account_id);
    const query = 'SELECT * FROM account WHERE account_id = $1';
    const { rows } = await pool.query(query, [account_id]);
    console.log('Query result:', rows);

    if (!rows || rows.length === 0) {
      throw new Error('Account not found');
    }

    return rows[0];
  } catch (error) {
    console.error('Error fetching account by ID:', error.message);
    throw error;
  }
}

/* **********************
 * Update account information
 * ********************* */
async function updateAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email
) {
  try {
    const query =
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *';
    const { rows } = await pool.query(query, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);

    if (!rows || rows.length === 0) {
      throw new Error('Account update failed');
    }

    return rows[0];
  } catch (error) {
    console.error('Error updating account:', error.message);
    throw error;
  }
}

/* **********************
 * Update password
 * ********************* */
async function updatePassword(account_id, hashedPassword) {
  const query =
    'UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *';
  const result = await pool.query(query, [hashedPassword, account_id]);
  console.log('Update result:', result.rows[0]); // Assuming only one row is updated
  return result.rows[0]; // Return the updated row
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  checkExistingEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};
