const e = require("express");
const { query, connect } = require("../../../dbs/mysql");
const { incrementSeq, decrementSeq, sortFn } = require("../../../helpers/seqHelper");
const seqeunce = require('../../../helpers/seqHelper');

const courseCategoryController = {
    list: (req, res) => {
        let conn;
        connect().then(_conn => {
            conn = _conn;
            const statement = `SELECT * FROM dbibridge.courseCategory;`
            return query(conn, statement, []);
        }).then(result => {
            const sortedResult = result.sort(sortFn);
            res.status(200).send({
                status: true,
                data: sortedResult
            });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    get: (req, res) => {
        const { id } = req.params;

        let conn;
        connect().then(_conn => {
            conn = _conn;
            const statement = `SELECT * FROM dbibridge.courseCategory WHERE id=?;`
            const variable = [ id ];
            return query(conn, statement, variable);
        }).then(result => {
            const data = result[0];

            res.status(200).send({
                status: true,
                data: data ? data : {}
            });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    create: (req, res) => {
        const { name, description } = req.body;
        let conn;

        connect().then(_conn => {
            conn = _conn;
            const statement = `SELECT * FROM dbibridge.courseCategory;`
            return query(conn, statement, []);
        }).then(result => {
            const { seq, seqBase } = seqeunce.getNextSeq(result);
            const statement = `
                INSERT INTO 
                    dbibridge.courseCategory (
                        name, description, seq, seqBase
                    )
                VALUES 
                    ?
                ;
            `;
            const variables = [ name, description, seq, seqBase ];
            return query(conn, statement, [ [ variables ] ]);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    update: (req, res) => {
        const { id } = req.params;
        const { name, description } = req.body;
        let conn;

        connect().then(_conn => {
            conn = _conn;
            const statement = `
                UPDATE
                    dbibridge.courseCategory
                SET
                    name=?,
                    description=?
                WHERE
                    id=?
                ;
            `;
            const variable = [ name, description, id ];
            return query(conn, statement, variable);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    delete: (req, res) => {
        const { id } = req.params;

        let conn;
        connect().then(_conn => {
            conn = _conn;
            const statement = `DELETE FROM dbibridge.courseCategory WHERE id=?;`
            const variable = [ id ];
            return query(conn, statement, variable);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    upSequence: (req, res) => {
        const { id } = req.params;

        let conn;
        connect().then(_conn => {
            conn = _conn;
            const statement = `SELECT * FROM dbibridge.courseCategory;`
            return query(conn, statement, [ ]);
        }).then(result => {
            const mappedResult = result.map(element => {
                element['objectId'] = element.id;
                return element;
            });
            const sequence = incrementSeq(id, mappedResult);

            if (!sequence) {
                return;
            }

            const { seq, seqBase } = sequence;

            const statement = `
                UPDATE
                    dbibridge.courseCategory
                SET
                    seq=?,
                    seqBase=?
                WHERE
                    id=?
                ;
            `;
            const variables = [ seq, seqBase, id ];
            return query(conn, statement, variables);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    },
    downSequence: (req, res) => {
        const { id } = req.params;

        let conn;
        connect().then(_conn => {
            conn = _conn;
            const statement = `SELECT * FROM dbibridge.courseCategory;`
            return query(conn, statement, [ ]);
        }).then(result => {
            const mappedResult = result.map(element => {
                element['objectId'] = element.id;
                return element;
            });
            const sequence = decrementSeq(id, mappedResult);

            if (!sequence) {
                return;
            }

            const { seq, seqBase } = sequence;

            const statement = `
                UPDATE
                    dbibridge.courseCategory
                SET
                    seq=?,
                    seqBase=?
                WHERE
                    id=?
                ;
            `;
            const variables = [ seq, seqBase, id ];
            return query(conn, statement, variables);
        }).then(_ => {
            res.status(200).send({ status: true });
        }).catch(error => {
            res.send({
                status: false,
                error: {
                    code: 500,
                    message: 'Internal Server Error: \n' + error
                }
            });
        }).finally(() => {
            conn.release();
        });
    }
}

module.exports = courseCategoryController;