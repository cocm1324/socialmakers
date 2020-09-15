const notice = require('express').Router();
const noticeController = require('./notice.controller');

notice.get('/', noticeController.get);
notice.post('/', noticeController.post);
notice.get('/:pageId', noticeController.getByPageId);
notice.put('/:pageId', noticeController.putByPageId);
notice.delete('/:pageId', noticeController.deleteByPageId);

module.exports = notice;