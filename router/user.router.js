const express = require('express');
const controller = require('../controller/user.controller');
const router = express.Router();

// 유저 관련

// 렌더링
router.get('/signin', controller.getSigninPage);
router.get('/signup', controller.getSignupPage);
router.get('/profile', controller.getProfilePage);
router.get('/sort', controller.getSortPage);

// 기능 개발
router.post('/signup', controller.postSignUp);
router.post('/signin', controller.postSignIn);

router.patch('/profile', controller.updateProfile);
router.patch('/profile/pw', controller.updateProfile_pw);

module.exports = router;
