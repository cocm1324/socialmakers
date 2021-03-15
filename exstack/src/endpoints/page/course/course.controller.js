const { dbConnectionPool, connect, query, startTransaction, rollbackTransaction, commitTransaction } = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');
const seqeunce = require('../../../helpers/seqHelper');


const courseController = {
    get: (req, res) => {
        let connection;

        connect().then(conn => {
            connection = conn;
            return query(connection, queryStatement.selectCourse(), null);
        }).then(result => {
            const courses = result.map(row => {
                const {pageId, pageName, seq, seqBase, imageId, messageDigest, extension} = row;
                return {
                    thumbImageUrl: `/api/static/image/${messageDigest}.${extension}`,
                    thumbImageId: imageId,
                    courseName: pageName,
                    courseId: pageId,
                    seq: seq,
                    seqBase: seqBase
                };
            });
            res.status(200).send({
                status: true,
                data: courses
            });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
            return;
        }).finally(() => {
            connection.release();
        });
    },
    
    post: (req, res) => {
        const { courseName, thumbImageId } = req.body;
        let connection;
        let seq, seqBase;
        let courseId;

        connect().then(conn => {
            connection = conn;
            return startTransaction(connection);
        }).then(_ => {
            return query(connection, queryStatement.selectCourseObjectIdSeqSeqBase(), null);
        }).then(result => {
            const { seq: _seq, seqBase: _seqBase } = seqeunce.getNextSeq(result);
            seq = _seq;
            seqBase = _seqBase;

            return query(connection, queryStatement.createCourseTransactionCreatePage(), [ courseName ]);
        }).then(result => {
            const { insertId } = result;
            if (!insertId) {
                throw 'transaction error';
            }
            courseId = insertId;
            return query(connection, queryStatement.createCourseTransactionCreateCourseInfo(), [ insertId, thumbImageId, seq, seqBase ]);
        }).then(result => {
            if (result) {
                commitTransaction(connection);
            }
            res.status(200).send({
                status: true,
                data: { courseId }
            });
        }).catch(error => {
            rollbackTransaction(connection).then(_ => {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'
                    }
                });
            });
        }).finally(() => {
            connection.release();
        });
    },
    
    getByPageId: (req, res) => {
        const {pageId} = req.params;
    
        dbConnectionPool.getConnection((connectionErr, connection) => {
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
    
            connection.query(queryStatement.selectCourseInfo(pageId), (err1, rows1) => {
                if (err1) {
                    connection.release();
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
                    courseId, bannerImageId, bannerMessageDigest, bannerExtension, bannerImageBlur, bannerColor,
                    thumbImageId, thumbMessageDigest, thumbExtension, courseName, description1, description2, 
                    fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
                    field1, field2, field3, field4, field5, field6, registerUrl
                } = rows1[0];
    
                const coursePage = {
                    courseId: courseId,
                    bannerImageId: bannerImageId,
                    bannerImageUrl: `/api/static/image/${bannerMessageDigest}.${bannerExtension}`,
                    bannerImageBlur: bannerImageBlur,
                    thumbImageId: thumbImageId,
                    thumbImageUrl: `/api/static/image/${thumbMessageDigest}.${thumbExtension}`,
                    courseName: courseName,
                    description1: description1,
                    description2: description2,
                    fieldTitle1: fieldTitle1,
                    fieldTitle2: fieldTitle2,
                    fieldTitle3: fieldTitle3,
                    fieldTitle4: fieldTitle4,
                    fieldTitle5: fieldTitle5,
                    fieldTitle6: fieldTitle6,
                    field1: field1,
                    field2: field2,
                    field3: field3,
                    field4: field4,
                    field5: field5,
                    field6: field6,
                    registerUrl: registerUrl
                }
    
                if (bannerColor) {
                    delete coursePage.bannerImageId;
                    delete coursePage.bannerImageUrl;
                    delete coursePage.bannerImageBlur;
                    coursePage['bannerColor'] = bannerColor;
                }
    
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
                    coursePage.contents = contents;
    
                    res.status(200).send({
                        status: true,
                        data: coursePage
                    });
                });
            });
        });
    },
    
    putByPageId: (req, res) => {
        const { pageId } = req.params;
        const {
            courseName, bannerImageId, bannerImageBlur, bannerColor, 
            description1, description2, registerUrl,
            fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
            field1, field2, field3, field4, field5, field6
        } = req.body;
    
        if (req.body.courseId != pageId) {
            res.send({
                status: false,
                error: {
                    code: 403,
                    message: 'Invalid Request'
                }
            });
            return;
        }

        let connection;

        connect().then(conn => {
            connection = conn;

            const sql = `
                UPDATE
                    dbibridge.page a
                    INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
                SET
                    a.pageName=?,
                    b.bannerImageId=?,
                    b.bannerImageBlur=?,
                    b.bannerColor=?,
                    b.description1=?,
                    b.description2=?,
                    b.fieldTitle1=?,
                    b.fieldTitle2=?,
                    b.fieldTitle3=?,
                    b.fieldTitle4=?,
                    b.fieldTitle5=?,
                    b.fieldTitle6=?,
                    b.field1=?,
                    b.field2=?,
                    b.field3=?,
                    b.field4=?,
                    b.field5=?,
                    b.field6=?,
                    b.registerUrl=?
                WHERE
                    a.pageId=?
                ;
            `
            const variable = [
                courseName, bannerImageId, bannerImageBlur, bannerColor, description1, description2,
                fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
                field1, field2, field3, field4, field5, field6, registerUrl, pageId
            ];

            return query(connection, sql, variable);
        }).then(result => {
            res.status(200).send({
                status: true,
                data: rows1
            });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: error
                }
            });
        });
    },

    updateCourseThumbnail: (req, res) => {
        const { pageId } = req.params;
        const { courseName, thumbImageId } = req.body;
        let connection;

        connect().then(conn => {
            connection = conn;

            const sql = `
                UPDATE
                    dbibridge.page a
                    INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
                SET
                    a.pageName=?,
                    b.thumbnailImageId=?
                WHERE
                    a.pageId=?
                ;
            `;
            const variable = [ courseName, thumbImageId, pageId ];

            return query(connection, sql, variable);
        }).then(result => {
            res.status(200).send({
                status: true,
                data: result
            });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: error
                }
            });
        }).finally(() => {
            connection.release();
        });
    },
    
    deleteByPageId: (req, res) => {
        const {pageId} = req.params;
    
        dbConnectionPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                rres.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.deleteCourse(pageId), (err1, rows1) => {
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
                    status: true,
                });
            });
        });
    },
    
    putUpSeqByPageId: (req, res) => {
        const {pageId} = req.params;
        const {courseId} = req.body;
    
        if (courseId != pageId) {
            res.send({
                status: false,
                error: {
                    code:403,
                    message: 'Invalid Request'
                }
            });
            return;
        }
    
        dbConnectionPool.getConnection((err, connection) => {
            if (err) {
                rres.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectCourseObjectIdSeqSeqBase(), (err1, rows1) => {
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
                }
    
                const {seq, seqBase} = seqeunce.incrementSeq(courseId, rows1);
    
                if (seq == undefined || seqBase == undefined) {
                    connection.release();
                    res.status(200).send({
                        status: true,
                    });
                    return;
                }
    
                connection.query(queryStatement.updateCourseSeq(courseId, seq, seqBase), (err2, rows2) => {
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
                    }
        
                    res.status(200).send({
                        status: true,
                    });
                });
            });
        });
    },
    
    putDownSeqByPageId: (req, res) => {
        const {pageId} = req.params;
        const {courseId} = req.body;
    
        if (courseId != pageId) {
            res.send({
                status: false,
                error: {
                    code:403,
                    message: 'Invalid Request'
                }
            });
            return;
        }
    
        dbConnectionPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                rres.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Fail to Establish Connection with Database'
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectCourseObjectIdSeqSeqBase(), (err1, rows1) => {
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
                }
    
                const {seq, seqBase} = seqeunce.decrementSeq(courseId, rows1);
    
                if (seq == undefined || seqBase == undefined) {
                    connection.release();
                    res.status(200).send({
                        status: true,
                    });
                    return;
                }
    
                connection.query(queryStatement.updateCourseSeq(pageId, seq, seqBase), (err2, rows2) => {
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
        
                    res.status(200).send({
                        status: true,
                    });
                });
            });
        });
    }
}

module.exports = courseController;