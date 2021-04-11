const course = require('express').Router();
const courseController = require('./course.controller');

course.get('/', courseController.get);
course.post('/', courseController.post);

course.get('/:pageId', courseController.getByPageId);
course.put('/:pageId', courseController.putByPageId);
course.put('/:pageId/thumbnail', courseController.updateCourseThumbnail);
course.put('/:pageId/courseCategory', courseController.updateCourseCategory);
course.delete('/:pageId', courseController.deleteByPageId);

course.post('/:pageId/upSeq', courseController.upSeq);
course.post('/:pageId/downSeq', courseController.downSeq);

module.exports = course;