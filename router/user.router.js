const express = require('express');
const controller = require('../controller/user.controller');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware')
// 유저 관련

// 렌더링
router.get('/signin', controller.getSigninPage);
router.get('/signup', controller.getSignupPage);
router.get('/signup/valid', controller.validateUserId);
router.get('/profile', auth.verifyAuthentication, controller.getProfilePage);

// 기능 개발
router.post('/signup', controller.postSignUp);
router.post('/signin', controller.postSignIn);

router.patch('/profile', auth.verifyAuthentication, controller.updateProfile);
router.patch('/profile/pw', auth.verifyAuthentication, controller.updateProfile_pw);

router.delete('/profile', auth.verifyAuthentication, controller.deleteProfile);

module.exports = router;
