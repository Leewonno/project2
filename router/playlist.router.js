const express = require('express');
const controller = require('../controller/playlist.controller');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware')

// 플레이리스트 관련

// 렌더링
router.get('/playlist', auth.verifyAuthentication, controller.getPlayListPage); // playlist 페이지
router.post('/playlist', auth.verifyAuthentication, controller.postPlayListPage);
// router.post('/playlist/like', auth.verifyAuthentication, controller.postPlayListLike);

// 기능 개발

module.exports = router;
