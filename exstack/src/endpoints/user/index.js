const user = require('express').Router();
const userController = require('./user.controller');

user.get('/', userController.get);
user.post('/', userController.post);
user.put('/', userController.put);
user.delete('/', userController.delete);

user.get('/login', userController.getLogin);
user.post('/login', userController.postLogin);


module.exports = user;