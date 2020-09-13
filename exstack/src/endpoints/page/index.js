const page = require('express').Router();
const pageController = require('./page.controller');

const aboutUs = require('./aboutUs');
const course = require('./course');
const notice = require('./notice');

page.get('/', pageController.get);
page.post('/:pageId', pageController.postByPageId);
page.put('/:pageId/:contentId', pageController.putByPageIdContentId); 
page.delete('/:pageId/:contentId', pageController.deleteByPageIdContentId);
page.put('/:pageId/:contentId/downSeq', pageController.putDownSeq);
page.put('/:pageId/:contentId/upSeq', pageController.putUpSeq);

page.use('/aboutUs', aboutUs);
page.use('/course', course);

module.exports = page;