const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

router.get('/', (req, res) => {
    res.send({
        status: true,
        message: "hello there"
    });
});

module.exports = router;