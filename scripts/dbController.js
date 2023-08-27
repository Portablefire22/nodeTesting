const mysql = require('mariadb');

const pool = mysql.createPool({
    connectionLimit: 1,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

let db = {};

db.insertUser = async function(username, email, password) {
    return await pool.query('INSERT INTO User (username, email, password) VALUES(?, ?, ?)', [username, email, password]);
}

db.getUserById = async function(id) {
    return await pool.query('SELECT * FROM User WHERE id= ?', [id]);
}

db.getUserByEmail = async function(email){
    return await pool.query('SELECT * FROM User WHERE email = ?', [email]);
}

db.getIdFromUsername = async function(username){
    return await pool.query('SELECT id FROM User WHERE username = ?', [username]);
}

module.exports = db;
