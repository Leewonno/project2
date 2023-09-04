const express = require('express');
const controller = require('../controller/playlist.controller');
const router = express.Router();

// 플레이리스트 관련

// 렌더링
router.get('/playlist', controller.getPlayListPage); // playlist 페이지

// 기능 개발

module.exports = router;
