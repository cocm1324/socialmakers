const mysql = require('mysql');

const connectionInfo = {
    // host: 'db.socialmakers.co.kr',
    host: 'localhost',
    user: 'ibridge',
    password: 'ibridge2019!',
    database: 'dbibridge',
    connectionLimit: 10
}

const dbConnectionPool = mysql.createPool(connectionInfo);

module.exports = dbConnectionPool;