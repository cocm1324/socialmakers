const courseCategory = require('express').Router();
const courseCategoryController = require('./course-category.controller');

courseCategory.get('/', courseCategoryController.list);
courseCategory.post('/', courseCategoryController.create);

courseCategory.get('/:id', courseCategoryController.get);
courseCategory.put('/:id', courseCategoryController.update);
courseCategory.delete('/:id', courseCategoryController.delete);

courseCategory.post('/:id/upSeq', courseCategoryController.upSequence);
courseCategory.post('/:id/downSeq', courseCategoryController.downSequence);

module.exports = courseCategory;