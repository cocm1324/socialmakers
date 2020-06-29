const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

const widthEnum = ['NARROW', 'MEDIUM', 'WIDE'];
const typeEnum = ['IMAGEURL', 'IMAGE', 'POST'];

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

        connection.query(queryStatement.selectPageAboutUs(), (err1, rows1) => {
            if (err1) {
                connection.release();
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            if (rows1.length == 0) {
                connection.release();
                res.status(404).send({
                    status: false,
                    message: 'No such page'
                });
                return;
            }

            const pageId = rows1[0].id;
            const pageName = rows1[0].name
            const pageType = rows1[0].page_type;

            connection.query(queryStatement.selectPageContent(pageId), (err2, rows2) => {
                connection.release();
                if (err2) {
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    });
                    return;
                }

                res.status(200).send({
                    status: true,
                    data: {
                        pageId: pageId,
                        pageName: pageName,
                        pageType: pageType,
                        contents: rows2.map(row => {
                            const rowMap = {
                                contentId: row.content_id,
                                seq: row.seq,
                                width: row.width,
                                type: row.type,
                            };
                            if (rowMap.type === 'IMAGE') {
                                rowMap['content'] = `/api/static/image/${row.message_digest}.${row.extension}`;
                                rowMap['imageId'] = row.image_id;
                            } else {
                                rowMap['content'] = row.content;
                            }

                            return rowMap;
                        })
                    }
                });
            });
        });
    });
});

router.post('/:pageId/:seq', (req, res) => {
    const {pageId, seq} = req.params;
    const {type, width, content, imageId} = req.body;

    const typeStr = typeEnum[type];
    const widthStr = widthEnum[width];

    if (req.body.pageId != pageId || req.body.seq != seq) {
        res.status(403).send({
            status: false,
            message: 'Invalid Request'
        });
        return;
    }

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }

        connection.beginTransaction((err1) => {
            if (err1) {
                connection.release(); 
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }
            connection.query(queryStatement.createPageContentTransactionCreateContent(seq, widthStr, typeStr, content), (err2, result1) => {
                if (err2) { 
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).send({
                            status: false,
                            message: 'Internal Server Error'
                        });
                        return;
                    });
                }

                const contentId = result1.insertId;
                if (!contentId) {
                    connection.rollback(() => {
                        connection.release();
                        res.status(500).send({
                            status: false,
                            message: 'Internal Server Error'
                        });
                        return;
                    });
                }
          
                connection.query(queryStatement.createPageContentTransactionCreatePageContent(pageId, contentId), (err3, result2) => {
                    if (err3) { 
                        connection.rollback(() => {
                            connection.release();
                            res.status(500).send({
                                status: false,
                                message: 'Internal Server Error'
                            });
                            return;
                        });
                    }

                    if (imageId && type==1) {
                        connection.query(queryStatement.createPageContentTransactionCreateImageContent(imageId, contentId), (err4, result3) => {
                            if (err4) { 
                                connection.rollback(() => {
                                    connection.release();
                                    res.status(500).send({
                                        status: false,
                                        message: 'Internal Server Error'
                                    });
                                    return;
                                });
                            }

                            connection.commit(null, (err5) => {
                                if (err5) { 
                                    connection.rollback(() => {
                                        connection.release();
                                        res.status(500).send({
                                            status: false,
                                            message: 'Internal Server Error'
                                        });
                                        return;
                                    });
                                }

                                connection.release();
                                res.status(200).send({
                                    status: true,
                                });
                            });
                        });
                    } else {
                        connection.commit(null, (err5) => {
                            if (err5) { 
                                connection.rollback(() => {
                                    connection.release();
                                    res.status(500).send({
                                        status: false,
                                        message: 'Internal Server Error'
                                    });
                                    return;
                                });
                            }

                            connection.release();
                            res.status(200).send({
                                status: true,
                            });
                        });
                    }
                });
            });
        });
    });
});

router.put('/:pageId/:seq', (req, res) => {
    const {pageId, seq} = req.params;
    const {type, width, content, imageId} = req.body;

    const typeStr = typeEnum[type];
    const widthStr = widthEnum[width];

    if (req.body.pageId != pageId || req.body.seq != seq) {
        res.status(403).send({
            status: false,
            message: 'Invalid Request'
        });
        return;
    }

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }

        connection.query(queryStatement.updatePageContent(pageId, seq, typeStr, widthStr, content, imageId), (err1, rows1) => {
            if (err1) {
                connection.release();
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            res.status(200).send({
                status: true,
                data: rows1
            });
        });
    });
}); 

router.delete('/:pageId/:seq', (req, res) => {
    const {pageId, seq} = req.params;

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }

        connection.query(queryStatement.deletePageContent(pageId, seq), (err1, rows1) => {
            if (err1) {
                connection.release();
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            res.status(200).send({
                status: true,
                data: rows1
            });
        });
    });
});

module.exports = router;