const assert = require('assert');
const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server');

const login = "testUser";
const password = "testPassword";

describe('Server Root Tests', () => {
    it('GET \'/\' should return Welcome string', (done) => {
        request(server).get('/')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200, 'Hello from API', done);
    });

    describe('User Endpoint Tests', () => {
        it('GET \'/user\' should return Welcome object', (done) => {
            request(server).get('/user')
                .expect(200, {
                    "status": true,
                    "message": "hello there, welcome from user api"
                }, done);
        });
        it('POST \'/user\' should return token', (done) => {
            request(server).post('/user')
                .send({
                    "login": `${login}`,
                    "password": `${password}`
                })
                .expect(200);
        });
        it('DELETE \'/user\' should return true', (done) => {
            request(server).delete('/user')
                .send({"login": login})
                .expect(200, {status: true}, done);     
        });
    });
});