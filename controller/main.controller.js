const models = require('../database/db');

exports.mainPage = (req, res) => {
  res.render('index');
};
exports.getChatListPage = async (req, res) => {
  const acr = [];
  const allChatRoom = await models.ChatRoom.findAll().then((result) => {
    for (let i = 0; i < result.length; i++) {
      acr.push(result[i].dataValues.name);
    }
    console.log(acr);
    res.render('chatlist', { data: acr });
  });
  //   console.log(allChatRoom.dataValues.name);
};

exports.getSearchPage = (req, res) => {
  res.render('search');
};
