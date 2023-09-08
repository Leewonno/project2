const express = require("express");
const router = express.Router();
const { controller } = require("../controller/main.controller");

router.get('/', controller.mainPage);
router.get('/chat/list', controller.getChatListPage);
router.get('/search', controller.getSearchPage);

// 채팅방 만들기 임시
router.get('/chat/upload', (req, res)=>{
    res.render("chat_upload");
})

module.exports = router;