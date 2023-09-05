const models = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'asdfasdfa';

//암호화
const bcryptPassword = (password) => {
  return bcrypt.hash(password, 10);
};
//비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compare(password, dbPassword);
};

exports.getSigninPage = (req, res) => {
  res.render('signin');
};

exports.getSignupPage = (req, res) => {
  res.render('signup');
};

exports.getProfilePage = (req, res) => {
  console.log('token', req.query.token);
  if (req.query.token == undefined) {
    console.log('n');
    res.render('profile');
  } else {
    let token = jwt.decode(req.query.token);
    models.Profile.findOne({
      where: { userid: token.userid },
    }).then((result) => {
      console.log(result.dataValues);
      res.json(result.dataValues);
    });
  }
};

exports.getSortPage = (req, res) => {
  res.render('sort');
};

exports.postSignUp = async (req, res) => {
  const user = await models.User.create({
    userid: req.body.userid,
    pw: await bcryptPassword(req.body.pw),
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

exports.postSignIn = async (req, res) => {
  const user = await models.User.findOne({
    where: { userid: req.body.userid },
  });
  if (!user) {
    res.json({ result: false, message: '아이디 없음' });
    return;
  }
  const ans = comparePassword(req.body.pw, user.pw);
  if (ans) {
    const token = jwt.sign({ userid: user.userid }, secret);
    res.json({ result: true, token });
  } else {
    res.json({ result: false });
  }
};

exports.updateProfile = (req, res) => {
  let token = jwt.decode(req.body.token);
  console.log(token);
  models.Profile.update(
    {
      name: req.body.name,
      nickname: req.body.nickname,
    },
    {
      where: { userid: token.userid },
    }
  ).then(() => {
    res.json({ result: true });
  }).catch((err)=>{
    res.json({ result: false });
    console.log(err);
  });
};

exports.updateProfile_pw = async (req, res) => {
  // console.log('pw', bcryptPassword(String(req.body.pw)));
  let token = jwt.decode(req.body.token);
  try{
    await models.User.update(
      {
        pw: await bcryptPassword(req.body.pw),
      },
      {
        where: { userid: token.userid },
      }
    );
    await models.Profile.update(
      {
        name: req.body.name,
        nickname: req.body.nickname,
      },
      {
        where: { userid: token.userid },
      }
    );
  }
  catch(err){
    console.log(err);
    res.json({ result: false });
  }
  res.json({ result: true });
};
