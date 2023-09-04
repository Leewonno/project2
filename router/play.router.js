const express = require('express');
const controller = require('../controller/play.controller');
const router = express.Router();

router.get('/playtest', controller.getPlaytest);
router.get('/stream', controller.getPlaySong);

module.exports = router;
