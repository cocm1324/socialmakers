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

                console.log(err2);
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

module.exports = router;