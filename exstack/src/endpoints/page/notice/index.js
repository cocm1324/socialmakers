const notice = require('express').Router();
const mysqlPool = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');
const seqeunce = require('../../../helpers/seqHelper');

notice.get('/', (req, res) => {
    const {pageNo} = req.query;
    let {pageCount, increment} = req.query;

    if (!pageCount) {
        pageCount = 20;
    }
    if (increment == undefined || increment == null || increment === 'true') {
        increment = true;
    } else if (increment === 'false') {
        increment = false;
    } else {
        increment = true;
    }


});

notice.post('/', (req, res) => {
    const {noticeName}
});

notice.get('/:pageId', (req, res) => {
    const {pageId} = req.params;

});

notice.put('/:pageId', (req, res) => {
    const {pageId} = req.params;

});

notice.delete('/:pageId', (req, res) => {
    const {pageId} = req.params;

});

module.exports = notice;