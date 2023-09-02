exports.main = (req, res)=>{
    res.render("index");
}

exports.header = (req, res)=>{
    res.render("header");   
}

exports.footer = (req, res)=>{
    res.render("footer");
}

exports.playbar = (req, res)=>{
    res.render("playbar");
}