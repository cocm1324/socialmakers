const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

const fileHelper = require('../helpers/fileHelper');
const mdHelper = require('../helpers/messageDigestHelper');
const sharp = require('sharp');
const fs = require('fs');

router.get('/', (req, res) => {
    let {pageCount, pageNo} = req.query;

    if (pageNo) {
        if (!pageCount) {
            pageCount = 10;
        }
        mysqlPool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            connection.query(queryStatement.selectPageImage(pageCount, pageNo), (err1, rows) => {
                connection.release();
                if (err1) {
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    });
                    return;
                } else {
                    const dataMap = rows.map(row => {
                        const {image_id, message_digest, file_name, extension} = row;
                        return {
                            imageId: image_id,
                            fileName: `${file_name}.${extension}`,
                            url: `/api/static/image/${message_digest}.${extension}`,
                            thumbUrl: `/api/static/image/thumb/${message_digest}.${extension}`,
                        }
                    });
                    res.send({
                        status: true,
                        pageNo: pageNo,
                        pageCount: pageCount,
                        rowCount: dataMap.length,
                        data: dataMap
                    });
                }
            });    
        });
    } else {
        mysqlPool.getConnection((err2, connection) => {

            if (err2) {
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            connection.query(queryStatement.selectAllImage(), (err3, rows) => {
                connection.release();
                if (err3) {
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    });
                    return;
                } else {
                    const dataMap = rows.map(row => {
                        const {image_id, message_digest, file_name, extension} = row;
                        return {
                            imageId: image_id,
                            fileName: `${file_name}.${extension}`,
                            url: `/api/static/image/${message_digest}.${extension}`,
                            thumbUrl: `/api/static/image/thumb/${message_digest}.${extension}`,
                        }
                    });
                    res.send({
                        status: true,
                        rowCount: dataMap.length,
                        data: dataMap
                    });
                }
            });    
        });
    }
});

router.post('/', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
            return;
        } else {
            const THUMBNAIL_WIDTH = 480;

            const file = req.files.upload;
            const fileNameSplit = fileHelper.splitFileName(file.name);
            const fileUid = Buffer.from(mdHelper.messageDigestWithTimeStamp(fileNameSplit[0], 32)).toString('base64');
            const fileName = `${fileUid}.${fileNameSplit[1]}`
            const url = `/api/static/image/${fileName}`;
            const thumbUrl = `/api/static/image/thumb/${fileName}`;

            if (file.mimetype.split('/')[0] === 'image') {
                file.mv(`./assets/image/${fileName}`);
                sharp(file.data).resize({
                    width:THUMBNAIL_WIDTH, 
                    fit: sharp.fit.cover
                }).toFile(`./assets/image/thumb/${fileName}`).then(info => {
                    mysqlPool.getConnection((err, connection) => {
                        if (err) {
                            res.status(500).send({
                                status: false,
                                message: 'Internal Server Error'
                            });
                            return;
                        }

                        connection.query(queryStatement.createSingleImage(fileUid, fileNameSplit[0], fileNameSplit[1]), (err, rows) => {
                            connection.release();

                            if (err) {
                                res.status(500).send({
                                    status: false,
                                    message: 'Internal Server Error'
                                });
                                return;
                            } else {
                                res.send({
                                    status: true,
                                    message: 'File is uploaded',
                                    data: {
                                        name: file.name,
                                        url: url,
                                        thumbnail: thumbUrl,
                                        result: rows
                                    }
                                });
                            }
                        });    
                    });
                }).catch((err) => {
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    });
                    return;
                });
            } else {
                res.send({
                    status: false,
                    message: 'Only image file is permitted'
                });
            }
        }
    } catch (err) {
        res.status(500).send(err);
        return;
    }
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
    if (id) {
        mysqlPool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            connection.query(queryStatement.selectSingleImage(id), (err1, rows) => {
                if (err1) {
                    connection.release();
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
                    });
                    return;
                } else if (rows.length <= 0) {
                    connection.release();
                    res.status(404).send({
                        status: false,
                        message: 'No such image'
                    });
                    return;
                } else {
                    const {message_digest, file_name, extension} = rows[0];
                    const imageDir = `./assets/image/${message_digest}.${extension}`;
                    const imageThumbDir = `./assets/image/thumb/${message_digest}.${extension}`;

                    connection.query(queryStatement.deleteSingleImage(id), (err2, rows) => {
                        connection.release();
                        if (err2) {
                            res.status(500).send({
                                status: false,
                                message: 'Internal Server Error'
                            });
                            return;
                        } else {
                            fs.unlinkSync(imageDir);
                            fs.unlinkSync(imageThumbDir);
                            res.send({
                                status: true,
                                data: `${file_name}.${extension}`
                            });
                        }
                    });
                }
            });    
        });
    } else {
        res.status(404).send({
            status: false,
            message: 'Not found'
        });
    }
});

module.exports = router;