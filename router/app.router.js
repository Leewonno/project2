const express = require('express');
const router = express.Router();
const controller = require('../controller/main.controller');
const controller1 = require('../controller/chat.controller');

router.get('/', controller.mainPage);
router.get('/chat/list', controller.getChatListPage);
router.get('/search', controller.getSearchPage);

router.get('/chat/', controller1.chat);
module.exports = router;
