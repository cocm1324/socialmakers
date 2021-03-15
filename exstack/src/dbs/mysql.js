const mysql = require('mysql');

const connectionInfo = {
    host: 'db.socialmakers.co.kr',
    // host: 'localhost',
    user: 'ibridge',
    password: 'ibridge2019!',
    database: 'dbibridge',
    connectionLimit: 10
}

const dbConnectionPool = mysql.createPool(connectionInfo);

function connect() {
    return new Promise((resolve, reject) => {
        dbConnectionPool.getConnection((error, conn) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(conn);
        });
    });
}

function query(conn, sql, variable) {
    return new Promise((resolve, reject) => {
        conn.query(sql, variable, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

function startTransaction(conn) {
    return new Promise((resolve, reject) => {
        conn.beginTransaction((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(true);
        });
    });
}

function rollbackTransaction(conn) {
    return new Promise((resolve, reject) => {
        conn.rollback((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(true);
        });
    });
}

function commitTransaction(conn) {
    return new Promise((resolve, reject) => {
        conn.commit((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(true);
        });
    });
}

module.exports = {
    dbConnectionPool,
    connect,
    query,
    startTransaction,
    rollbackTransaction,
    commitTransaction
};