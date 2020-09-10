const aboutUs = require('express').Router();
const mysqlPool = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');

aboutUs.get('/', (req, res) => {
    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error'
                }
            });
            return;
        }

        connection.query(queryStatement.selectPageAboutUs(), (err1, rows1) => {
            connection.release();
            if (err1) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error \n' + err1
                    }
                });
                return;
            }

            if (rows1.length == 0) {
                res.status(200).send({
                    status: false,
                    error: {
                        code: 404,
                        message: 'No such page'
                    }
                });
                return;
            }

            const {pageId, pageName, bannerImageId, bannerMessageDigest, bannerExtension, bannerImageBlur, bannerColor} = rows1[0]; 
            const bannerImageUrl = `/api/static/image/${bannerMessageDigest}.${bannerExtension}`;
            const contents = rows1.map(row => {
                const {contentId, seq, seqBase, width, type, background, imageId, messageDigest, extension, content} = row;
                const rowMap = {
                    contentId: contentId,
                    seq: seq,
                    seqBase: seqBase,
                    width: width,
                    type: type
                };
                if (background) {
                    rowMap.background = background;
                }
                if (content) {
                    rowMap.content = content;
                }
                if (imageId) {
                    rowMap.imageId = imageId;
                    rowMap.imageUrl = `/api/static/image/${messageDigest}.${extension}`;
                }

                return rowMap;
            });

            const data = {
                pageId: pageId,
                pageName: pageName,
                bannerImageId: bannerImageId,
                bannerImageUrl: bannerImageUrl,
                bannerImageBlur: bannerImageBlur,
                contents: contents
            };

            if (bannerColor) {
                data['bannerColor'] = bannerColor;
            }

            res.status(200).send({
                status: true,
                data: data
            });
        });
    });
});

aboutUs.put('/', (req, res) => {
    const {pageName, bannerImageId, bannerImageBlur, bannerColor} = req.body;

    if (!pageName || !bannerImageId) {
        res.send({
            status: false,
            error: {
                code:403,
                message: 'Invalid Request'
            }
        });
        return;
    }

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + err
                }
            });
            return;
        }

        connection.query(queryStatement.updatePageAboutUs(pageName, bannerImageId, bannerImageBlur, bannerColor), (err1, rows1) => {
            connection.release();
            if (err1) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error: \n' + err1
                    }
                });
                return;
            }

            res.status(200).send({
                status: true
            });
        });
    });
});

module.exports = aboutUs;