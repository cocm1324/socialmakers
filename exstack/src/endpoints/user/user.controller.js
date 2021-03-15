const sha256 = require('js-sha256');
const jwtHelper = require('../../helpers/jwtHelper');
const { dbConnectionPool } = require('../../dbs/mysql');
const queryStatement = require('../../query/query');

const TOKEN_EXPIRATION = 3;

const userController = {
    get: (req, res) => {
        res.send({
            status: true,
            message: "hello there, welcome from user api"
        });
    },
    post: (req, res) => {
        const {login, password} = req.body;
    
        dbConnectionPool.getConnection((err, connection) => {
            if (err) {
                res.status(200).send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'   
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectUser(login), (err1, rows) => {
                if (err1) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1  
                        }
                    });
                    return;
                }
    
                if (rows.length > 0) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 402,
                            message: 'User Already Exists'
                        }
                    });
                    return;
                }
    
                const passwordHash = sha256.sha256(password);
                const admin = 0;
    
                connection.query(queryStatement.createUser(login, passwordHash, admin), (err2, rows1) => {
                    connection.release();
                    if (err2) {
                        res.status(200).send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error: \n' + err2
                            }
                        });
                        return;
                    }
    
                    const expiration = new Date();
                    expiration.setDate(expiration.getDate() + TOKEN_EXPIRATION);
                    const token = jwtHelper.createToken(login, expiration, true);
    
                    res.status(200).send({
                        status: true,
                        data: {
                            token: token,
                            login: login
                        }
                    });
                });
            });
        });
    },
    put: (req, res) => {
        const {login, password} = req.body;
    
        dbConnectionPool.getConnection((err, connection) => {
            if (err) {
                res.status(200).send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'   
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectUser(login), (err1, rows) => {
                if (err1) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1  
                        }
                    });
                    return;
                }
    
                if (rows.length == 0) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 404,
                            message: 'User Doesn\'t Exists' 
                        }
                    });
                    return;
                }
    
                const passwordHash = sha256.sha256(password);
                const admin = 0;
    
                connection.query(queryStatement.updateUser(login, passwordHash, admin), (err2, rows1) => {
                    connection.release();
                    if (err2) {
                        res.status(200).send({
                            status: false,
                            error: {
                                code: 500,
                                message: 'Internal Server Error: \n' + err2
                            }
                        });
                        return;
                    }
    
                    const expiration = new Date();
                    expiration.setDate(expiration.getDate() + TOKEN_EXPIRATION);
                    const token = jwtHelper.createToken(login, expiration, true);
    
                    res.status(200).send({
                        status: true,
                        data: {
                            token: token,
                            login: login
                        }
                    });
                });
            });
        });
    },
    delete: (req, res) => {
        const {login} = req.body;
    
        dbConnectionPool.getConnection((err, connection) => {
            if (err) {
                res.status(200).send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error'   
                    }
                });
                return;
            }
    
            connection.query(queryStatement.selectUser(login), (err1, rows) => {
                if (err1) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1  
                        }
                    });
                    return;
                }
    
                if (rows.length == 0) {
                    connection.release();
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 404,
                            message: 'User Doesn\'t Exists' 
                        }
                    });
                    return;
                }
    
                connection.query(queryStatement.deleteUser(login), (err2, rows1) => {
                    connection.release();
                    if (err2) {
                        res.status(200).send({
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
    getLogin: (req, res) => {
        if (!req.headers.authorization) {
            res.status(200).send({
                status: false,
                error: {
                    code: 403,
                    message: 'Unauthorized'
                }
            });
            return;
        }
    
        const token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {
            res.status(200).send({
                status: false,
                error: {
                    code: 403,
                    message: 'Unauthorized'
                }
            });
            return;
        }
        
        const {subject, expiration, admin} = jwtHelper.unmarshallToken(token);
        if (!subject || !expiration || !admin) {
            res.status(200).send({
                status: false,
                error: {
                    code: 403,
                    message: 'Unauthorized'
                }
            });
            return;
        }
    
        const expirationDate = new Date(expiration);
        const currentDate = new Date();
        
        if (expirationDate < currentDate) {
            res.status(200).send({
                status: false,
                error: {
                    code: 401,
                    message: 'Session has expired'
                }
            });
            return;
        }
    
        if (expirationDate.valueOf() - currentDate.valueOf() < 1000 * 60 * 6) {
            const newExpiration = new Date();
            newExpiration.setDate(newExpiration.getDate() + TOKEN_EXPIRATION);
            const newToken = jwtHelper.createToken(subject, newExpiration, true);
    
            res.status(200).send({
                status: true,
                data: {
                    token: newToken,
                    login: subject
                }
            });
        } else {
            res.status(200).send({
                status: true,
                data: {
                    token: token,
                    login: subject
                }
            });
        }
    },
    postLogin: (req, res) => {
        const {login, password} = req.body;
        const passwordHash = sha256.sha256(password);
    
        dbConnectionPool.getConnection((err, connection) => {
            if (err) {
                connection.release();
                res.status(200).send({
                    status: false,
                    error: {
                        code: 500,
                        message: 'Internal Server Error: \n'+ err   
                    }
                });
                return;
            }
            connection.query(queryStatement.selectUser(login), (err1, rows) => {
                connection.release();
                if (err1) {
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 500,
                            message: 'Internal Server Error: \n' + err1
                        }
                    });
                    return;
                }
    
                if (!rows || (rows && rows.length == 0)) {
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 404,
                            message: "login or password is wrong"
                        }
                    });
                    return;
                }
    
                const loginData = rows[0].login;
                const passwordData = rows[0].password;
                
                if (passwordHash !== passwordData) {
                    res.status(200).send({
                        status: false,
                        error: {
                            code: 404,
                            message: "login or password is wrong"
                        }
                    });
                    return;
                }
    
                const expiration = new Date();
                expiration.setDate(expiration.getDate() + TOKEN_EXPIRATION);
                const token = jwtHelper.createToken(loginData, expiration, true);
    
                res.status(200).send({
                    status: true,
                    data: {
                        token: token,
                        login: loginData
                    }
                });
            });
        });
    }
}

module.exports = userController;