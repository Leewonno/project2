exports.mainPage = (req, res)=>{
    res.render("index");
}
exports.getChatListPage =  (req, res)=>{
    res.render("chatlist");
}

exports.getSearchPage = (req, res)=>{
    res.render("search");
}