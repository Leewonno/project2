const express = require("express");
const router = express.Router();
const controller = require("../controller/main.controller");

router.get('/', controller.mainPage);
router.get('/chat/list', controller.getChatListPage);
router.get('/search', controller.getSearchPage);

module.exports = router;