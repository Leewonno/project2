const express = require('express');
const router = express.Router();
const { controller } = require('../controller/main.controller');
const controller1 = require('../controller/chat.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth.verifyAuthentication, controller.mainPage);
router.get('/chat/list', auth.verifyAuthentication, controller.getChatListPage);
router.get('/search', controller.getSearchPage);

// 채팅방 만들기 임시
router.get('/chat/upload', controller1.chat_upload_render);
router.post('/chat/upload', controller1.chat_upload);

router.get('/chat', controller1.chat);
router.post('/chat', controller1.chatP);

router.post('/chat/list', controller1.chat_tag);

// 장르별 요소 버튼 기능 
router.get('/byGenre', controller.getByMenuGenre);
// 플레이리스트 좋아요 기능
// 좋아요 토글
router.post('/playlist/like', auth.verifyAuthentication, controller.likeToggle);

module.exports = router;
