const models = require('../models');
const bcrypt = require('bcrypt');

exports.getSigninPage = (req, res) => {
  res.render('signin');
};

exports.getSignupPage = (req, res) => {
  res.render('signup');
};

exports.getProfilePage = (req, res) => {
  res.render('mypage');
};

exports.getSortPage = (req, res) => {
  res.render('sort');
};

//암호화
const bcryptPassword = (password) => {
  return bcrypt.hashSync(password, saltNum);
};

//비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

exports.postSignUp = (req, res) => {
  models.User.create({
    userid: req.body.userid,
    pw: bcryptPassword(req.body.pw),
    email: req.body.email,
  }).then((result) => {
    res.send({
      userid: req.body.userid,
      pw: bcryptPassword(req.body.pw),
      email: req.body.email,
    });
  });
};
