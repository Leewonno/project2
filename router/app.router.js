const express = require('express');
const router = express.Router();
const { controller } = require('../controller/main.controller');
const controller1 = require('../controller/chat.controller');

router.get('/', controller.mainPage);
router.get('/chat/list', controller.getChatListPage);
router.get('/search', controller.getSearchPage);

// 채팅방 만들기 임시
router.get('/chat/upload', controller1.chat_upload_render);
router.post('/chat/upload', controller1.chat_upload);

router.get('/chat', controller1.chat);
router.post('/chat', controller1.chatP);

router.post('/chat/list', controller1.chatJoin_info);

module.exports = router;
