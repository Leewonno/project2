const models = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createJwtToken, verifyJwtToken } = require('../utils/jwt');
// const secret = 'asdfasdfa';

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

   console.log(req.userid);
    if(!req.userid) {
      res.render('signin');
    } else { 

      models.Profile.findOne({
        where: { userid: req.userid },
      }).then((result) => {
        console.log(result.dataValues);
  
        res.render('profile', { data: result.dataValues})
      });
    }
      
};

exports.postSignUp = async (req, res) => {
  try {
    const img = 'https://kdt-wonno2.s3.ap-northeast-2.amazonaws.com/img/n_img.png';
    const { userid, pw, email, grade, name, nickname, birth, gender } = req.body;
    const validUserId = await models.User.findOne({ where: {userid: userid} });

    if(validUserId) {
      res.send({result: false, message: "userid duplicate error"})
    } else {    
        const user = await models.User.create({
          userid, pw: await bcryptPassword(pw), email, grade, 
          profile: {
            name, nickname, birth, gender, profile_img: img
          }
        }, {
          include: models.Profile
        });
        console.log(user);
      res.send({result: true, message: "signup success !"});
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.postSignIn = async (req, res) => {
  const user = await models.User.findOne({
    where: { userid: req.body.userid },
  });

  if (!user) {
    res.json({ result: false, message: '아이디 혹은 비밀번호가 틀렸습니다.' });
    return;
  }

  const profile = await models.Profile.findOne({
    where: { userid: req.body.userid },
  });
  
  const ans = await comparePassword(req.body.pw, user.pw);
  if (ans) {
    const token = createJwtToken(user.userid, profile.dataValues.nickname);
    res.cookie('token', token).json({ result: true });
  } else {
    res.json({ result: false, message: '아이디 혹은 비밀번호가 틀렸습니다2.' });
  }
};

exports.updateProfile = (req, res) => {
  console.log(req.userid);
  if(!req.userid) {
    res.render('signin');
  } else {

    models.Profile.update(
      {
        name: req.body.name,
        nickname: req.body.nickname,
        profile_img: req.body.profile_img,
      },
      {
        where: { userid: req.userid },
      }
    ).then(() => {
        res.json({ result: true });
      })
      .catch((err) => {
        res.json({ result: false });
        console.log(err);
      });
  }

};

exports.updateProfile_pw = async (req, res) => {

  try {
    console.log(req.userid);
    if(!req.userid) {
      res.render('signin');
    } else {

      await models.User.update(
        {
          pw: await bcryptPassword(req.body.pw),
        },
        {
          where: { userid: req.userid },
        }
      );
      await models.Profile.update(
        {
          name: req.body.name,
          nickname: req.body.nickname,
          profile_img: req.body.profile_img,
        },
        {
          where: { userid: req.userid },
        }
      );
    }
  } catch (err) {
    console.log(err);
    res.json({ result: false });
  }
  res.json({ result: true });
};

exports.deleteProfile = async (req, res) => {
  try {
    console.log(req.userid);
    if(!req.userid) {
      res.render('signin');
    } else {

      await models.User.destroy({ where: { userid: req.userid } });
      await models.Profile.destroy({ where: { userid: req.userid } });
    }
  } catch (err) {
    console.log(err);
    res.json({ result: false });
  }
  res.json({ result: true });
};
