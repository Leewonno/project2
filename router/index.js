const express = require("express");
const router = express.Router();
const controller = require("../controller/Cmain");

router.get("/", controller.main);
router.get("/html/header", controller.header);
router.get("/html/footer", controller.footer);


// 임시

router.get('/login', (req, res)=>{
    res.render("login");
})

router.get('/signup', (req, res)=>{
    res.render("signup");
})

router.get('/profile', (req, res)=>{
    res.render("mypage");
})

router.get('/song', (req, res)=>{
    res.render("song");
})

router.get('/song/upload', (req, res)=>{
    res.render("song_upload");
})

router.get('/playlist', (req, res)=>{
    res.render("mypage");
})

router.get('/chat/list', (req, res)=>{
    res.render("chatlist");
})

router.get('/search', (req, res)=>{
    res.render("search");
})

router.get('/sort', (req, res)=>{
    res.render("sort");
})

module.exports = router;