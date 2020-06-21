const express = require('express');
const sha256 = require('js-sha256');
const jwtHelper = require('../helpers/jwtHelper');
const router = express.Router();
const mysqlPool = require('../dbs/mysql');
const queryStatement = require('../query/query');

const TOKEN_EXPIRATION = 3;

router.get('/', (req, res) => {
    res.send({
        status: true,
        message: "hello there, welcome from user api"
    });
});

router.post('/register', (req, res) => {
    const {login, password} = req.body;

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }

        connection.query(queryStatement.selectUser(login), (err1, rows) => {
            if (err1) {
                connection.release();

                console.log(err1);
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            if (rows.length > 0) {
                connection.release();

                res.status(402).send({
                    status: false,
                    message: 'User Already Exists'
                });
                return;
            }

            const passwordHash = sha256.sha256(password);
            
            connection.query(queryStatement.createUser(login, passwordHash, 'ADMIN'), (err2, rows) => {
                connection.release();

                if (err2) {
                    console.log(err2);
                    res.status(500).send({
                        status: false,
                        message: 'Internal Server Error'
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
});

router.get('/login', (req, res) => {
    if (!req.headers.authorization) {
        res.status(403).send({
            status: false,
            message: 'Unauthorized'
        });
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        res.status(403).send({
            status: false,
            message: 'Unauthorized'
        });
        return;
    }
    
    const {subject, expiration, admin} = jwtHelper.unmarshallToken(token);
    if (!subject || !expiration || !admin) {
        res.status(403).send({
            status: false,
            message: 'Unauthorized'
        });
        return;
    }

    const expirationDate = new Date(expiration);
    const currentDate = new Date();
    
    if (expirationDate < currentDate) {
        res.status(401).send({
            status: false,
            message: 'Session has expired'
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
});

router.post('/login', (req, res) => {
    const {login, password} = req.body;
    const passwordHash = sha256.sha256(password);

    mysqlPool.getConnection((err, connection) => {
        if (err) {
            connection.release();
            console.log(err);
            res.status(500).send({
                status: false,
                message: 'Internal Server Error'
            });
            return;
        }
        connection.query(queryStatement.selectUser(login), (err1, rows) => {
            connection.release();

            if (err1) {
                console.log(err);
                res.status(500).send({
                    status: false,
                    message: 'Internal Server Error'
                });
                return;
            }

            if (!rows || (rows && rows.length == 0)) {
                res.status(404).send({
                    status: false,
                    message: "login or password is wrong"
                });
                return;
            }

            const loginData = rows[0].login;
            const passwordData = rows[0].password;
            
            if (passwordHash !== passwordData) {
                res.status(404).send({
                    status: false,
                    message: "login or password is wrong"
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
});

module.exports = router;