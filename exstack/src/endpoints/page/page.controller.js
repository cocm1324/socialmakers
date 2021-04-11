const { dbConnectionPool } = require('../../dbs/mysql');
const queryStatement = require('../../query/query');
const seqeunce = require('../../helpers/seqHelper');

const pageController = {
    get: (req, res) => {
        res.send({
            status: true,
            message: "Hello from Page"
        });
    },

    postByPageId: (req, res) => {
        const {pageId} = req.params;
        const {type, width, content, imageId, background} = req.body;
    
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
    },
    putByPageIdContentId: (req, res) => {
        const { pageId, contentId } = req.params;
        const { type, width, content, imageId, background } = req.body;
    
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
    },
    deleteByPageIdContentId: (req, res) => {
        const {pageId, contentId} = req.params;
    
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
    },
    putDownSeq: (req, res) => {
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
    },
    putUpSeq: (req, res) => {
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
    }
}

module.exports = pageController;