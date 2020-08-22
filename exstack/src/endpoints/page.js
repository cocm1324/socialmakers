const express = require('express');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');
const seqeunce = require('../helpers/seqHelper');

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

            const {pageId, name, bannerImageId, bannerMessageDigest, bannerExtension} = rows1[0]; 
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


            res.status(200).send({
                status: true,
                data: {
                    pageId: pageId,
                    name: name,
                    imageId: bannerImageId,
                    imageUrl: bannerImageUrl,
                    contents: contents
                }
            });
        });
    });
});

router.put('/aboutus', (req, res) => {
    const {name, imageId} = req.body;

    if (!name || !imageId) {
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

        connection.query(queryStatement.updatePageAboutUs(name, imageId), (err1, rows1) => {
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
});

router.get('/course', (req, res) => {
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
                    thumbnailUrl: `/api/static/image/${messageDigest}.${extension}`,
                    thumbnailId: imageId,
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
});

router.post('/course', (req, res) => {
    const {
        courseName, registerUrl,
        thumbImageId, pageImageId, 
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
            connection.query(queryStatement.selectCourseObjectSeqSeqBase(), (err1, result1) => {
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

                    const pageId = result2.insertId;
                    if (!pageId) {
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
                        pageId, thumbImageId, pageImageId, description1, description2, seq, seqBase, registerUrl,
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
                                status: true
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get('/course/:pageId', (req, res) => {
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

            const row = rows1[0];
            const coursePage = {
                courseId: row.courseId,
                pageImageId: row.bannerImageId,
                pageImageUrl: `/api/static/image/${row.bannerMessageDigest}.${row.bannerExtension}`,
                thumbImageId: row.thumbnailImageId,
                thumbImageUrl: `/api/static/image/${row.thumbnailMessageDigest}.${row.thumbnailExtension}`,
                courseName: row.courseName,
                description1: row.description1,
                description2: row.description2,
                fieldTitle1: row.fieldTitle1,
                fieldTitle2: row.fieldTitle2,
                fieldTitle3: row.fieldTitle3,
                fieldTitle4: row.fieldTitle4,
                fieldTitle5: row.fieldTitle5,
                fieldTitle6: row.fieldTitle6,
                field1: row.field1,
                field2: row.field2,
                field3: row.field3,
                field4: row.field4,
                field5: row.field5,
                field6: row.field6,
                registerUrl: row.registerUrl
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
                    const rowMap = {
                        contentId: row2.contentId,
                        seq: row2.seq,
                        seqBase: row2.seqBase,
                        width: row2.width,
                        type: row2.type,
                    };
                    if (row2.background) {
                        rowMap.background = row2.background;
                    }
                    if (rowMap.type === 1) {
                        rowMap.content = `/api/static/image/${row2.messageDigest}.${row2.extension}`;
                        rowMap.imageId = row2.imageId;
                    } else {
                        rowMap.content = row2.content;
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
});

router.put('/course/:pageId', (req, res) => {
    const {pageId} = req.params;
    const {
        courseName, registerUrl,
        thumbImageId, pageImageId, 
        description1, description2, 
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
        field1, field2, field3, field4, field5, field6
    } = req.body;

    if (req.body.courseId != pageId) {
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
            pageId, courseName, description1, description2, registerUrl, 
            fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
            field1, field2, field3, field4, field5, field6, pageImageId, thumbImageId), (err1, rows1) => {
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
});

router.delete('/course/:pageId', (req, res) => {
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
});

router.put('/course/upSeq/:pageId', (req, res) => {
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

            connection.query(queryStatement.updateCourseSeq(pageId, seq, seqBase), (err2, rows2) => {
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
});

router.put('/course/downSeq/:pageId', (req, res) => {
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
});

router.get('/notice', (req, res) => {

});

router.post('/notice', (req, res) => {

});

router.post('/:pageId', (req, res) => {
    const {pageId} = req.params;
    const {type, width, content, imageId, background} = req.body;

    if (req.body.pageId != pageId || req.body.seq != seq || req.body.seqBase != seqBase) {
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
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Fail to Establish Connection with Database'
                }
            });
            return;
        }

        connection.query(queryStatement.selectPageContentObjectIdSeqSeqBase(pageId), (err1, rows1) => {
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

            const {seq, seqBase} = seqeunce.getNextSeq(rows1);

            connection.query(queryStatement.createPageContent(pageId, seq, seqBase, width, type, content, background, imageId), (err2, rows2) => {
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
});

router.put('/:pageId/:contentId', (req, res) => {
    const {pageId, contentId} = req.params;
    const {type, width, content, imageId, background} = req.body;

    if (req.body.pageId != pageId || req.body.contentId != contentId) {
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

        connection.query(queryStatement.updatePageContent(pageId, contentId, type, width, content, imageId, background), (err1, rows1) => {
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
}); 

router.delete('/:pageId/:contentId', (req, res) => {
    const {pageId, contentId} = req.params;

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

        connection.query(queryStatement.deletePageContent(pageId, contentId), (err1, rows1) => {
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
            }

            res.status(200).send({
                status: true,
            });
        });
    });
});

router.put('/:pageId/:contentId/downSeq', (req, res) => {
    const {pageId, contentId} = req.params;

    if (req.body.pageId != pageId || req.body.contentId != contentId) {
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

        connection.query(queryStatement.selectPageContentObjectIdSeqSeqBase(pageId), (err1, rows1) => {
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

            const {seq, seqBase} = seqeunce.decrementSeq(contentId, rows1);

            if (seq == undefined || seqBase == undefined) {
                connection.release();
                res.status(200).send({
                    status: true,
                });
                return;
            }

            connection.query(queryStatement.updatePageContentSeq(pageId, contentId, seq, seqBase), (err2, rows2) => {
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
});

router.put('/:pageId/:contentId/upSeq', (req, res) => {
    const {pageId, contentId} = req.params;

    if (req.body.pageId != pageId || req.body.contentId != contentId) {
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

        connection.query(queryStatement.selectPageContentObjectIdSeqSeqBase(pageId), (err1, rows1) => {
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

            const {seq, seqBase} = seqeunce.incrementSeq(contentId, rows1);

            if (seq == undefined || seqBase == undefined) {
                connection.release();
                res.status(200).send({
                    status: true,
                });
                return;
            }

            connection.query(queryStatement.updatePageContentSeq(pageId, contentId, seq, seqBase), (err2, rows2) => {
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
});

module.exports = router;