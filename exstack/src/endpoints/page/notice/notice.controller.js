const mysqlPool = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');
const seqeunce = require('../../../helpers/seqHelper');

const noticeController = {
    get: (req, res) => {
        let {pageNo, pageCount, increment} = req.query;

        if (!pageNo) {
            pageNo = 1;
        } else {
            pageNo = parseInt(pageNo);
        }
        if (!pageCount) {
            pageCount = 10;
        }
        if (increment === 'true') {
            increment = true;
        } else if (increment == undefined || increment == null || increment === 'false') {
            increment = false;
        } else {
            increment = false;
        }

        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }

            connection.query(queryStatement.selectPageNotice(pageCount, pageNo, increment), (err1, rows1) => {
                connection.release();
                if (err1) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1
                        }
                    });
                }

                const {rowCount} = rows1[0];
                const notices = rows1.map(row1 => {
                    const {noticeId, noticeName, creationDateTime, updateDateTime, featured, published} = row1;
                    return {
                        noticeId: noticeId,
                        noticeName: noticeName,
                        creationDateTime: creationDateTime,
                        updateDateTime: updateDateTime,
                        featured: featured,
                        published: published
                    };
                });

                res.send({
                    status: true,
                    data: {
                        pageNo: pageNo,
                        pageCount: rows1.length,
                        rowCount: rowCount,
                        notices: notices
                    }
                });
            });
        });
    },
    post: (req, res) => {
        const {pageName, bannerImageId, bannerImageBlur, bannerColor} = req.body;
    
        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) {
                    connection.release(); 
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + beginTransactionErr
                        }
                    });
                    return;
                }
                connection.query(queryStatement.createNoticeTransactionCreatePage(pageName), (err1, result1) => {
                    if (err1) {
                        connection.release();
                        res.send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error: \n' + err1
                            }
                        });
                    }
    
                    const {insertId} = result1;
                    if (!insertId) {
                        connection.rollback(() => {
                            connection.release();
                            res.send({
                                status: false,
                                error: {
                                    code: 500,
                                    message: 'Internal Server Error'
                                }
                            });
                            return;
                        });
                    }
    
                    connection.query(queryStatement.createNoticeTransactionCreateNoticeInfo(
                        insertId, bannerImageId, bannerImageBlur, bannerColor
                    ), (err2, result2) => {
                        if (err2) {
                            connection.release();
                            res.send({
                                status: false,
                                error: {
                                    code: 500,
                                    message: 'Internal Server Error: \n' + err2
                                }
                            });
                        }
    
                        connection.commit(null, (commitErr) => {
                            if (commitErr) { 
                                connection.rollback(() => {
                                    connection.release();
                                    res.send({
                                        status: false,
                                        error: {
                                            code: 500,
                                            message: 'Internal Server Error: \n' + commitErr
                                        }
                                    });
                                    return;
                                });
                            }
    
                            connection.release();
                            res.status(200).send({
                                status: true,
                                data: {noticeId: insertId}
                            });
                        });
                    });
                });
            });
        });
    },
    getByPageId: (req, res) => {
        const {pageId} = req.params;
    
        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectNoticeInfo(pageId), (err1, rows1) => {
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

                const {
                    noticeId, noticeName, bannerImageId, bannerMessageDigest, bannerExtension, 
                    bannerImageBlur, bannerColor, creationDateTime, updateDateTime, featured, published
                } = rows1[0];

                connection.query(queryStatement.selectPageContent(pageId), (err2, rows2) => {
                    connection.release();
                    if (err2) {
                        res.send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error: \n' + err2
                            }
                        });
                        return;
                    }
    
                    const contents = rows2.map(row2 => {
                        const {
                            contentId, seq, seqBase, width, type, background,
                            messageDigest, extension, imageId, content
                        } = row2;
    
                        const rowMap = {
                            contentId: contentId,
                            seq: seq,
                            seqBase: seqBase,
                            width: width,
                            type: type,
                        };
                        
                        if (row2.background) {
                            rowMap.background = background;
                        }
                        
                        if (rowMap.type === 1) {
                            rowMap.imageUrl = `/api/static/image/${messageDigest}.${extension}`;
                            rowMap.imageId = imageId;
                        } else {
                            rowMap.content = content;
                        }
        
                        return rowMap;
                    });

                    const data = {
                        noticeId: noticeId,
                        noticeName: noticeName,
                        bannerImageId: bannerImageId,
                        bannerImageUrl: `/api/static/image/${bannerMessageDigest}.${bannerExtension}`,
                        bannerImageBlur: bannerImageBlur,
                        creationDateTime: creationDateTime,
                        updateDateTime: updateDateTime,
                        featured: featured,
                        published: published,
                        contents: contents
                    };

                    if (bannerColor) {
                        delete data.bannerImageId;
                        delete data.bannerImageUrl;
                        delete data.bannerImageBlur;

                        data['bannerColor'] = bannerColor;
                    }

                    res.status(200).send({
                        status: true,
                        data: data
                    });
                });
            });
        });
    },
    putByPageId: (req, res) => {
        const {pageId} = req.params;
        const {noticeId, noticeName, bannerImageId, bannerImageBlur, bannerColor} = req.body;
    
        if (noticeId != pageId) {
            res.send({
                status: false,
                error: {
                    code: 403,
                    message: 'Invalid Request'
                }
            });
            return;
        }    

        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.updateNoticeInfo(
                pageId, noticeName, bannerImageId, bannerImageBlur, bannerColor
            ), (err1, rows1) => {
                connection.release();
                if (err1) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1
                        }
                    });
                }
    
                res.status(200).send({
                    status: true
                });
            });
        });
    },
    deleteByPageId: (req, res) => {
        const {pageId} = req.params;
    
        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.deleteNotice(pageId), (err1, row1) => {
                connection.release();
                if (err1) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1
                        }
                    });
                }
    
                res.status(200).send({
                    status: true
                });
            });
        });
    }
}

module.exports = noticeController;