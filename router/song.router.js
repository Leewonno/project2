const express = require('express');
const router = express.Router();
const { controller } = require('../controller/song.controller');
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth.middleware')
// 음악 관련

// 페이지 렌더링 
router.get('/song/upload', controller.getSongUploadPage);
router.get('/song', auth.verifyAuthentication, controller.getSongInfoPage); // 곡 상세 정보 렌더링 

// 앨범 커버, 음악 파일 업로드
router.post('/dynamic/img', upload.uploadImage, controller.uploadImg);
router.post('/dynamic/song', upload.uploadAudio, controller.uploadSong);

// 곡 정보 업로드 (관리자)
router.post('/song/upload', controller.insertSongByAdmin);

// 곡 정렬 - 1. 메인 페이지 5개씩
router.get('/song/sort', controller.getSongBySortInMain);

// 곡 정렬 - 2. 전체 곡 정렬 

// 좋아요 토글
router.post('/song/like', auth.verifyAuthentication, controller.likeToggle);

module.exports = router;