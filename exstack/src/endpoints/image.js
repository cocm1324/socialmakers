const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

const fileHelper = require('../helpers/fileHelper');
const mdHelper = require('../helpers/messageDigestHelper');
const sharp = require('sharp');
const fs = require('fs');
const getPixels = require('get-pixels');
const { format } = require('path');


const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
const rgbToHex = (r, g, b) => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


router.get('/', (req, res) => {
    let {pageCount, pageNo} = req.query;

    if (pageNo) {
        if (!pageCount) {
            pageCount = 10;
        }
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

            connection.query(queryStatement.selectPageImage(pageCount, pageNo), (err1, rows) => {
                connection.release();
                if (err1) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error'
                        }
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
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'
                    }
                });
                return;
            }

            connection.query(queryStatement.selectAllImage(), (err3, rows) => {
                connection.release();
                if (err3) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error'
                        }
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

router.post('/', (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                error: {
                    code: 401,
                    message: 'No file uploaded'
                }
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
                sharp(file.data).resize({width:THUMBNAIL_WIDTH, fit: sharp.fit.cover, format: fileNameSplit[1]}).toFile(`./assets/image/thumb/${fileName}`).then(info => {
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

                        connection.query(queryStatement.createSingleImage(fileUid, fileNameSplit[0], fileNameSplit[1]), (err1, rows) => {
                            connection.release();

                            if (err1) {
                                res.send({
                                    status: false,
                                    error: {
                                        code: 500,
                                        message: 'Internal Server Error'
                                    }
                                });
                                return;
                            } else {
                                res.send({
                                    status: true,
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
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    });
                    return;
                });
            } else {
                res.send({
                    status: false,
                    error: {
                        code: 401,
                        message: 'Only image file is permitted'
                    }
                });
            }
        }
    } catch (err) {
        res.send({
            status: false,
            error: {
                code: 500,
                message: 'Internal Server Error'
            }
        });
        return;
    }
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
    if (id) {
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

            connection.query(queryStatement.selectSingleImage(id), (err1, rows) => {
                if (err1) {
                    connection.release();
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    });
                    return;
                } else if (rows.length <= 0) {
                    connection.release();
                    res.send({
                        status: false,
                        error: {
                            code: 404,
                            message: 'No such image'
                        }
                    });
                    return;
                } else {
                    const {message_digest, file_name, extension} = rows[0];
                    const imageDir = `./assets/image/${message_digest}.${extension}`;
                    const imageThumbDir = `./assets/image/thumb/${message_digest}.${extension}`;

                    connection.query(queryStatement.deleteSingleImage(id), (err2, rows) => {
                        connection.release();
                        if (err2) {
                            res.send({
                                status: false,
                                error: {
                                    code: 500,
                                    message: 'Internal Server Error'
                                }
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
        res.send({
            status: false,
            error: {
                code: 404,
                message: 'Not found'
            }
        });
    }
});

router.post('/eyedrop/:id', (req, res) => {
    const {id} = req.params;
    const {x, y, width, height, imageId} = req.body;

    if (!imageId || imageId != id || !x || !y || !width || !height) {
        res.send({
            status: false,
            error: {
                code: 403, 
                message: 'Invalid Request'
            }
        });
        return;
    }

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error'
                }
            });
            return;
        }

        connection.query(queryStatement.selectSingleImage(imageId), (err1, rows1) => {
            connection.release();
            if (err1) {
                console.log(err1)
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'
                    }
                });
                return;
            }
            
            const {message_digest, extension} = rows1[0];

            getPixels(`./assets/image/thumb/${message_digest}.${extension}`, (err2, pixelData) => {
                if (err2) {
                    getPixels(`./assets/image/${message_digest}.${extension}`, (err3, pixelDataAlternative) => {
                        if (err3) {
                            res.send({
                                status: false,
                                error: {
                                    code: 500,
                                    message: 'Internal Server Error'
                                }
                            });
                            return;
                        }

                        const tx = Math.round((x * pixelDataAlternative.shape[0]) / width);
                        const ty = Math.round((y * pixelDataAlternative.shape[1]) / height);
                        const target = (ty * pixelDataAlternative.shape[0] * pixelDataAlternative.shape[2]) + (tx * pixelDataAlternative.shape[2]);
                        const pixels = [...pixelDataAlternative.data];

                        const r = pixels[target];
                        const g = pixels[target + 1];
                        const b = pixels[target + 2];
                        const a = pixels[target + 3];

                        const code = rgbToHex(r, g, b);

                        res.status(200).send({
                            status: true,
                            data: code
                        });
                    });
                } else {
                    const tx = Math.round((x * pixelData.shape[0]) / width);
                    const ty = Math.round((y * pixelData.shape[1]) / height);
                    const target = (ty * pixelData.shape[0] * pixelData.shape[2]) + (tx * pixelData.shape[2]);
                    const pixels = [...pixelData.data];

                    const r = pixels[target];
                    const g = pixels[target + 1];
                    const b = pixels[target + 2];
                    const a = pixels[target + 3];

                    const code = rgbToHex(r, g, b);

                    res.status(200).send({
                        status: true,
                        data: code
                    });
                }
            });
        });
    });
});

module.exports = router;