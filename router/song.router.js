const express = require('express');
const router = express.Router();
const { controller } = require('../controller/song.controller');
const upload = require('../utils/upload');
const { auth } = require('../middleware/auth.middleware')
// 음악 관련

// 페이지 렌더링 
router.get('/song/upload', controller.getSongUploadPage);
// 곡 상세 페이지 및 댓글 페이징 처리 
router.get('/song', auth.verifyAuthentication, controller.getSongInfoPage);

// 앨범 커버, 음악 파일 업로드
router.post('/dynamic/img', upload.uploadImage, controller.uploadImg);
router.post('/dynamic/song', upload.uploadAudio, controller.uploadSong);

// 곡 정보 업로드 (관리자)
router.post('/song/upload', controller.insertSongByAdmin);

// 곡 정렬 페이지 + 페이징 처리 -> 노션 확인
router.get('/sort', auth.verifyAuthentication, controller.getSortPage);
router.get('/song/sort', controller.getSongBySort);
router.get('/song/sort/genre', controller.getSongByGenre);

// 곡 재생 정보 반환
router.get('/song/play', controller.getPlaySongData);

// 좋아요 토글
router.post('/song/like', auth.verifyAuthentication, controller.likeToggle);

// 댓글 
router.post('/song/comment', auth.verifyAuthentication, controller.createComment);
router.patch('/song/comment', auth.verifyAuthentication, controller.updateComment);
router.delete('/song/comment', auth.verifyAuthentication, controller.deleteComment);

module.exports = router;