const express = require("express");
const controller = require("../controller/song.controller");
const router = express.Router();

// 음악 관련

// 렌더링 
router.get('/song', controller.getSongInfoPage); 
router.get('/song/upload', controller.getSongUploadPage);

// 기능 개발

module.exports = router;