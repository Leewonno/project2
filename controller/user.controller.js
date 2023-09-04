const models = require('../database/db');
const bcrypt = require('bcrypt');

//암호화
const bcryptPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
//비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

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

exports.postSignUp = async (req, res) => {
  const user = await models.User.create({
    userid: req.body.userid,
    pw: bcryptPassword(req.body.pw),
    email: req.body.email,
    grade: req.body.grade,
  });
  await models.Profile.create({
    userid: req.body.userid,
    name: req.body.name,
    nickname: req.body.nickname,
    gender: req.body.gender,
  });
};
