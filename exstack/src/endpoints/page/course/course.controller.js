const mysqlPool = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');
const seqeunce = require('../../../helpers/seqHelper');

const courseController = {
    get: (req, res) => {
        mysqlPool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error: \n' + err
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectCourse(), (err1, rows1) => {
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
    
                const courses = rows1.map(row => {
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
            });
        });
    },
    
    post: (req, res) => {
        const {
            courseName, registerUrl, thumbImageId, 
            bannerImageId, bannerImageBlur, bannerColor,
            description1, description2, 
            fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
            field1, field2, field3, field4, field5, field6
        } = req.body;
    
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
                connection.query(queryStatement.selectCourseObjectIdSeqSeqBase(), (err1, result1) => {
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
    
                    const {seq, seqBase} = seqeunce.getNextSeq(result1);
    
                    connection.query(queryStatement.createCourseTransactionCreatePage(courseName), (err2, result2) => {
                        if (err2) { 
                            connection.rollback(() => {
                                connection.release();
                                res.send({
                                    status: false,
                                    error: {
                                        code: 500,
                                        message: 'Internal Server Error: \n' + err2
                                    }
                                });
                                return;
                            });
                        }
    
                        const {insertId} = result2;
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
    
                        connection.query(queryStatement.createCourseTransactionCreateCourseInfo(
                            insertId, thumbImageId, bannerImageId, bannerImageBlur, bannerColor, description1, description2, seq, seqBase, registerUrl,
                            fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
                            field1, field2, field3, field4, field5, field6), (err3, result3) => {
                            if (err3) { 
                                connection.rollback(() => {
                                    connection.release();
                                    res.send({
                                        status: false,
                                        error: {
                                            code: 500,
                                            message: 'Internal Server Error: \n' + err3
                                        }
                                    });
                                    return;
                                });
                            }
                        
                            connection.commit(null, (err4) => {
                                if (err4) { 
                                    connection.rollback(() => {
                                        connection.release();
                                        res.send({
                                            status: false,
                                            error: {
                                                code: 500,
                                                message: 'Internal Server Error: \n' + err4
                                            }
                                        });
                                        return;
                                    });
                                }
    
                                connection.release();
                                res.status(200).send({
                                    status: true,
                                    data: {courseId: insertId}
                                });
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
        const {pageId} = req.params;
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
    
            connection.query(queryStatement.updateCourse(
                pageId, courseName, bannerImageId, bannerImageBlur, bannerColor, description1, description2, registerUrl,
                fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
                field1, field2, field3, field4, field5, field6
            ), (err1, rows1) => {
                connection.release();
    
                if (err1) {
                    res.send({
                        status: false,
                        error: {
                            code: 500,
                            message: err1
                        }
                    });
                    return;
                }
    
                res.status(200).send({
                    status: true,
                    data: rows1
                });
            });
        });
    },
    
    deleteByPageId: (req, res) => {
        const {pageId} = req.params;
    
        mysqlPool.getConnection((connectionErr, connection) => {
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
    
        mysqlPool.getConnection((err, connection) => {
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
    
        mysqlPool.getConnection((connectionErr, connection) => {
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