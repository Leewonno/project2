exports.getSigninPage = (req, res)=>{
    res.render("signin");
}

exports.getSignupPage = (req, res)=>{
    res.render("signup");
}

exports.getProfilePage = (req, res)=>{
    res.render("mypage");
}

exports.getSortPage = (req, res)=>{
    res.render("sort");
}
