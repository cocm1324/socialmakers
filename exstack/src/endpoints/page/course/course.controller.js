const { dbConnectionPool, connect, query, startTransaction, rollbackTransaction, commitTransaction } = require('../../../dbs/mysql');
const queryStatement = require('../../../query/query');
const seqeunce = require('../../../helpers/seqHelper');
const { sortFn } = require('../../../helpers/seqHelper');

const courseController = {
    get: (req, res) => {
        let connection;

        connect().then(conn => {
            connection = conn;
            return query(connection, queryStatement.selectCourse(), null);
        }).then(result => {
            const courses = result.map(row => {
                const { pageId, pageName, seq, seqBase, description1, imageId, messageDigest, extension } = row;
                return {
                    thumbImageUrl: `/api/static/image/${messageDigest}.${extension}`,
                    thumbImageId: imageId,
                    courseName: pageName,
                    courseId: pageId,
                    description1: description1,
                    seq: seq,
                    seqBase: seqBase
                };
            }).sort(sortFn);
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
        const { pageId } = req.params;
        let connection;
        let coursePage;

        connect().then(conn => {
            connection = conn;
            const sql = `
                SELECT
                    b.courseId, a.pageName as courseName, b.seq, b.seqBase, b.bannerColor, b.bannerImageBlur,
                    c.imageId AS thumbImageId, c.messageDigest AS thumbMessageDigest, c.extension AS thumbExtension,
                    d.imageId AS bannerImageId, d.messageDigest AS bannerMessageDigest, d.extension AS bannerExtension,
                    a.pageName, b.description1, b.description2, b.fieldTitle1, b.fieldTitle2, b.fieldTitle3, b.fieldTitle4, b.fieldTitle5, b.fieldTitle6,
                    b.field1, b.field2, b.field3, b.field4, b.field5, b.field6, b.registerUrl
                FROM
                    dbibridge.page a
                    LEFT JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
                    LEFT JOIN dbibridge.image c ON b.thumbnailImageId=c.imageId
                    LEFT JOIN dbibridge.image d ON b.bannerImageId=d.imageId
                WHERE 
                    a.pageId=? AND a.pageType=1
                ;
            `;
            const variable = [ pageId ];
            return query(connection, sql, variable);
        }).then(result => {

            if (!result || result.length == 0) {
                throw 'no result with provided key';
            }

            const {
                courseId, bannerImageId, bannerMessageDigest, bannerExtension, bannerImageBlur, bannerColor,
                thumbImageId, thumbMessageDigest, thumbExtension, courseName, description1, description2, 
                fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
                field1, field2, field3, field4, field5, field6, registerUrl
            } = result[0];

            const bannerImageUrl = !!bannerImageId ? `/api/static/image/${bannerMessageDigest}.${bannerExtension}` : null;
            const thumbImageUrl = !!bannerImageId ? `/api/static/image/${thumbMessageDigest}.${thumbExtension}` : null;

            coursePage = {
                courseId, bannerImageId, bannerImageUrl, bannerImageBlur, thumbImageId, thumbImageUrl, 
                courseName, description1, description2, fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, 
                fieldTitle5, fieldTitle6, field1, field2, field3, field4, field5, field6, registerUrl
            }

            if (bannerColor) {
                delete coursePage.bannerImageId;
                delete coursePage.bannerImageUrl;
                delete coursePage.bannerImageBlur;
                coursePage['bannerColor'] = bannerColor;
            }

            const sql = `
                SELECT 
                    a.pageId, a.contentId, a.seq, a.seqBase, 
                    a.width, a.type, a.content, a.background, 
                    b.imageId, b.messageDigest, b.extension
                FROM 
                    dbibridge.pageContent a
                    LEFT JOIN dbibridge.image b ON a.imageId=b.imageId
                WHERE
                    a.pageId=?
                ;
            `;
            const variable = [ pageId ];
            return query(connection, sql, variable);
        }).then(result => {

            const contents = result.map(element => {
                const {
                    contentId, seq, seqBase, width, type, background,
                    messageDigest, extension, imageId, content
                } = element;

                const rowMap = {
                    contentId: contentId,
                    seq: seq,
                    seqBase: seqBase,
                    width: width,
                    type: type,
                };
                
                if (element.background) {
                    rowMap.background = background;
                }

                if (rowMap.type === 1) {
                    const imageUrl = !!imageId ? `/api/static/image/${messageDigest}.${extension}` : null;
                    rowMap.imageUrl = imageUrl;
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
                    a.pageName=?, b.bannerImageId=?, b.bannerImageBlur=?, b.bannerColor=?, 
                    b.description1=?, b.description2=?, b.fieldTitle1=?, b.fieldTitle2=?, 
                    b.fieldTitle3=?, b.fieldTitle4=?, b.fieldTitle5=?, b.fieldTitle6=?, 
                    b.field1=?, b.field2=?, b.field3=?, b.field4=?, b.field5=?, b.field6=?, 
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
        const { courseName, thumbnailImageId } = req.body;
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
            const variable = [ courseName, thumbnailImageId, pageId ];

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
    
    upSeq: (req, res) => {
        const { pageId } = req.params;
    
        let conn;

        if (!pageId) {
            res.send({
                status: false,
                error: {
                    code: 403,
                    message: 'Invalid Request'
                }
            });
            return;
        }
    
        connect().then(_conn => {
            conn = _conn;
            return query(conn, queryStatement.selectCourseObjectIdSeqSeqBase(), []);
        }).then(result => {
            const { seq, seqBase } = seqeunce.incrementSeq(pageId, result);
            if (seq == undefined || seqBase == undefined) {
                return;
            }
            return query(conn, queryStatement.updateCourseSeq(pageId, seq, seqBase), []);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: ' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    
    downSeq: (req, res) => {
        const { pageId } = req.params;
    
        let conn;

        if (!pageId) {
            res.send({
                status: false,
                error: {
                    code: 403,
                    message: 'Invalid Request'
                }
            });
            return;
        }
    
        connect().then(_conn => {
            conn = _conn;
            return query(conn, queryStatement.selectCourseObjectIdSeqSeqBase(), []);
        }).then(result => {
            const { seq, seqBase } = seqeunce.decrementSeq(pageId, result);
            if (seq == undefined || seqBase == undefined) {
                return;
            }
            return query(conn, queryStatement.updateCourseSeq(pageId, seq, seqBase), []);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: ' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },

    updateCourseCategory: (req, res) => {
        const { pageId } = req.params;
        const { courseCategoryId } = req.body;
    
        if (!pageId || !courseCategoryId) {
            res.send({
                status: false,
                error: {
                    code: 403,
                    message: 'Invalid Request'
                }
            });
            return;
        }

        let conn;

        connect().then(_conn => {
            conn = _conn;

            const statement = `
                UPDATE
                    dbibridge.courseInfo
                SET
                    courseCategoryId=?
                WHERE
                    courseId=?
                ;
            `;
            const variables = [ courseCategoryId, pageId ];

            return query(conn, statement, variables);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: ' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    }
}

module.exports = courseController;