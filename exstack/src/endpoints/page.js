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
                        message: 'Internal Server Error'
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

            const pageId = rows1[0].page_id;
            const name = rows1[0].name;
            const headerImageId = rows1[0].header_image_id;
            const headerImageUrl = `/api/static/image/${rows1[0].header_message_digest}.${rows1[0].header_extension}`;
            const contents = rows1.map(row => {
                const rowMap = {
                    contentId: row.content_id,
                    seq: row.seq,
                    seqBase: row.seq_base,
                    width: row.width === widthEnum[0] ? 0 : row.width === widthEnum[1] ? 1 : 2,
                    type: row.type === typeEnum[0] ? 0 : row.type === typeEnum[1] ? 1 : 2,
                };
                if (row.background) {
                    rowMap.background = row.background;
                }
                if (rowMap.type === 1) {
                    rowMap.content = `/api/static/image/${row.message_digest}.${row.extension}`;
                    rowMap.imageId = row.image_id;
                } else {
                    rowMap.content = row.content;
                }

                return rowMap;
            });


            res.status(200).send({
                status: true,
                data: {
                    pageId: pageId,
                    name: name,
                    imageId: headerImageId,
                    imageUrl: headerImageUrl,
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
                    message: 'Internal Server Error'
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

router.get('/course', (req, res) => {
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

        connection.query(queryStatement.selectCourse(), (err1, rows1) => {
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

            const courses = rows1.map(row => {
                return {
                    courseThumb: `/api/static/image/${row.message_digest}.${row.extension}`,
                    courseThumbThumb: `/api/static/image/thumb/${row.message_digest}.${row.extension}`,
                    courseThumbImageId: row.image_id,
                    courseName: row.name,
                    courseId: row.page_id,
                    seq: row.seq,
                    seqBase: row.seq_base
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
        name, registerUrl, seq, seqBase,
        thumbImageId, pageImageId, 
        description1, description2, 
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
        field1, field2, field3, field4, field5, field6
    } = req.body

    // page -> (course -> course_image) and page_image

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error1'
                }
            });
            return;
        }

        connection.beginTransaction((err1) => {
            if (err1) {
                connection.release(); 
                res.send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error2'
                    }
                });
                return;
            }
            connection.query(queryStatement.createCourseTransactionCreatePage(name), (err2, result1) => {
                if (err2) { 
                    connection.rollback(() => {
                        connection.release();
                        res.send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error3'
                            }
                        });
                        return;
                    });
                }

                const pageId = result1.insertId;
                if (!pageId) {
                    connection.rollback(() => {
                        connection.release();
                        res.send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error4'
                            }
                        });
                        return;
                    });
                }

                connection.query(queryStatement.createCourseTransactionCreatePageImage(pageId, pageImageId), (err3, result2) => {
                    if (err3) { 
                        connection.rollback(() => {
                            connection.release();
                            res.send({
                                status: false,
                                error: {
                                    code: 500,
                                    message: 'Internal Server Error5'
                                }
                            });
                            return;
                        });
                    }

                    connection.query(queryStatement.createCourseTransactionCreateCourse(
                        pageId, description1, description2, seq, seqBase, registerUrl,
                        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
                        field1, field2, field3, field4, field5, field6), (err4, result3) => {
                        if (err4) { 
                            console.log(err4)
                            connection.rollback(() => {
                                connection.release();
                                res.send({
                                    status: false,
                                    error: {
                                        code: 500,
                                        message: 'Internal Server Error6'
                                    }
                                });
                                return;
                            });
                        }
                        
                        connection.query(queryStatement.createCourseTransactionCreateCourseImage(pageId, thumbImageId), (err5, result4) => {
                            if (err5) { 
                                connection.rollback(() => {
                                    connection.release();
                                    res.send({
                                        status: false,
                                        error: {
                                            code: 500,
                                            message: 'Internal Server Error7'
                                        }
                                    });
                                    return;
                                });
                            }

                            connection.commit(null, (err6) => {
                                if (err6) { 
                                    connection.rollback(() => {
                                        connection.release();
                                        res.send({
                                            status: false,
                                            error: {
                                                code: 500,
                                                message: 'Internal Server Error8'
                                            }
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
                    });
                });
            });
        });
    });
});

router.get('/course/:pageId', (req, res) => {
    const {pageId} = req.params;

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

        connection.query(queryStatement.selectCourseInfo(pageId), (err1, rows1) => {
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

            const row = rows1[0]
            const coursePage = {
                courseId: row.page_id,
                imageId: row.image_id,
                imageUrl: `/api/static/image/${row.message_digest}.${row.extension}`,
                imageThumbUrl: `/api/static/image/thumb/${row.message_digest}.${row.extension}`,
                courseName: row.name,
                description1: row.description1,
                description2: row.description2,
                fieldTitle1: row.field_title1,
                fieldTitle2: row.field_title2,
                fieldTitle3: row.field_title3,
                fieldTitle4: row.field_title4,
                fieldTitle5: row.field_title5,
                fieldTitle6: row.field_title6,
                field1: row.field1,
                field2: row.field2,
                field3: row.field3,
                field4: row.field4,
                field5: row.field5,
                field6: row.field6,
                registerUrl: row.register_url
            }

            connection.query(queryStatement.selectPageContent(pageId), (err2, rows2) => {
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

                const contents = rows2.map(row2 => {
                    const rowMap = {
                        contentId: row2.content_id,
                        seq: row2.seq,
                        seqBase: row2.seq_base,
                        width: row2.width === widthEnum[0] ? 0 : row2.width === widthEnum[1] ? 1 : 2,
                        type: row2.type === typeEnum[0] ? 0 : row2.type === typeEnum[1] ? 1 : 2,
                    };
                    if (row2.background) {
                        rowMap.background = row2.background;
                    }
                    if (rowMap.type === 1) {
                        rowMap.content = `/api/static/image/${row2.message_digest}.${row2.extension}`;
                        rowMap.imageId = row2.image_id;
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
        name, registerUrl, seq, seqBase,
        thumbImageId, pageImageId, 
        description1, description2, 
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
        field1, field2, field3, field4, field5, field6
    } = req.body;

    if (req.body.pageId != pageId) {
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
                    message: 'Internal Server Error'
                }
            });
            return;
        }

        connection.query(queryStatement.updateCourse(
            pageId, name, description1, description2, seq, seqBase, registerUrl, 
            fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
            field1, field2, field3, field4, field5, field6, pageImageId, thumbImageId), (err1, rows1) => {
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
                data: rows1
            });
        });
    });
});

router.delete('/course/:pageId', (req, res) => {
    const {pageId} = req.params;

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

        connection.query(queryStatement.deleteCourse(pageId), (err1, rows1) => {
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

router.put('/course/updateSeq/:pageId', (req, res) => {
    const {pageId} = req.params;
    const {courseId, seq, seqBase} = req.body;

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

        connection.query(queryStatement.updateCourseSeq(pageId, seq, seqBase), (err1, rows1) => {
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

router.get('/notice', (req, res) => {

});

router.post('/notice', (req, res) => {

});

router.post('/:pageId/:seq/:seqBase', (req, res) => {
    const {pageId, seq, seqBase} = req.params;
    const {type, width, content, imageId, background} = req.body;

    const typeStr = typeEnum[type];
    const widthStr = widthEnum[width];

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

        connection.beginTransaction((err1) => {
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
            connection.query(queryStatement.createPageContentTransactionCreateContent(seq, seqBase, widthStr, typeStr, content, background), (err2, result1) => {
                if (err2) { 
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


                const contentId = result1.insertId;
                if (!contentId) {
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
          
                connection.query(queryStatement.createPageContentTransactionCreatePageContent(pageId, contentId), (err3, result2) => {
                    if (err3) { 
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

                    if (imageId && type==1) {
                        connection.query(queryStatement.createPageContentTransactionCreateImageContent(imageId, contentId), (err4, result3) => {
                            if (err4) { 
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

                            connection.commit(null, (err5) => {
                                if (err5) { 
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

router.put('/:pageId/:seq/:seqBase', (req, res) => {
    const {pageId, seq, seqBase} = req.params;
    const {type, width, content, imageId, background} = req.body;

    const typeStr = typeEnum[type];
    const widthStr = widthEnum[width];

    if (req.body.pageId != pageId || req.body.seq != seq || req.body.seqBase != seqBase) {
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
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error'
                }
            });
            return;
        }

        connection.query(queryStatement.updatePageContent(pageId, seq, seqBase, typeStr, widthStr, content, imageId, background), (err1, rows1) => {
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

router.delete('/:pageId/:seq/:seqBase', (req, res) => {
    const {pageId, seq, seqBase} = req.params;

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

        connection.query(queryStatement.deletePageContent(pageId, seq, seqBase), (err1, rows1) => {
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

module.exports = router;