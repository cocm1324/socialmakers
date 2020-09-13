const image = require('express').Router();
const imageController = require('./image.controller');

image.get('/', imageController.get);
image.post('/', imageController.post);
image.delete('/:id', imageController.deleteById);
image.post('/eyedrop/:id', imageController.postEyedropById);

module.exports = image;