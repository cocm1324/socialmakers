const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

router.get('/', (req, res) => {
    res.send({
        status: true,
        message: "hello from post"
    });
});

router.get('/aboutUs', (req, res) => {
    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }

        connection.query(queryStatement.selectPageImage(pageCount, pageNo), (err1, rows) => {});
    });
})

module.exports = router;