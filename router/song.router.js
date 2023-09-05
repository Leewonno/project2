const express = require('express');
const router = express.Router();
const controller = require('../controller/song.controller');
const upload = require('../utils/upload');
// 음악 관련

// 렌더링 
router.get('/song', controller.getSongInfoPage); 
router.get('/song/upload', controller.getSongUploadPage);

// 기능 개발
router.post('/dynamic/img', upload.uploadImage, controller.uploadImg);
router.post('/dynamic/song', upload.uploadAudio, controller.uploadSong);

router.post('/song/upload', controller.insertSongByAdmin);

router.get('/song/detail', controller.getSongInfo);

module.exports = router;