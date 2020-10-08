const course = require('express').Router();
const courseController = require('./course.controller');

course.get('/', courseController.get);
course.post('/', courseController.post);
course.get('/:pageId', courseController.getByPageId);
course.put('/:pageId', courseController.putByPageId);
course.delete('/:pageId', courseController.deleteByPageId);
course.put('/upSeq/:pageId', courseController.putUpSeqByPageId);
course.put('/downSeq/:pageId', courseController.putDownSeqByPageId);

module.exports = course;