const models = require('../database/db');

exports.mainPage = (req, res) => {
  res.render('index');
};
exports.getChatListPage = (req, res) => {
  const acr = [];
  const allChatRoom = models.ChatRoom.findAll().then((result) => {
    for (let i = 0; i < result.length; i++) {
      acr.push(result[i].dataValues.name);
    }
    console.log(acr);
  });
  //   console.log(allChatRoom.dataValues.name);
  res.render('chatlist');
};

exports.getSearchPage = (req, res) => {
  res.render('search');
};
