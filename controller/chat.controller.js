const jwt = require('jsonwebtoken');
const models = require('../database/db');
const roomList = [];

let room;
let chatRoom;
let userID;
let Rname;
let chatInfo;

exports.chat = async (req, res) => {
  room = await req.query.room;
  console.log('dd', room);
  console.log('coo', req.cookies.token);
  userID = jwt.decode(req.cookies.token).userid;
  // const n = window.localStorage.getItem('token');
  try {
    chatRoom = await models.ChatRoom.findOne({
      where: { name: room },
    });
    // console.log("app",app.locals.layout);
    res.locals.layout = 'layouts/layout2';
    // console.log(chatRoom.tag);
    res.render('chat', { data: chatRoom });
  } catch (error) {
    console.log(error);
  }
};

exports.chatP = async (req, res) => {
  Rname = req.cookies.token;
  Rname = jwt.decode(Rname).userid;
  res.send({ userid: Rname, roomName: chatRoom.name, member: chatRoom.member, cover_img: chatRoom.cover_img });
};

exports.chat_upload_render = (req, res) => {
  res.render('chat_upload');
};

exports.chat_upload = async (req, res) => {
  console.log('name', req.body.name);
  try {
    const chatRoom = await models.ChatRoom.create({
      name: req.body.name,
      tag: req.body.tag,
      cover_img: req.body.cover_img,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.connection = (io, socket) => {
  console.log('room', room);
  console.log('접속');
  //채팅방 목록 보내기
  // socket.emit('roomList', roomList);

  //채팅방 만들기 생성
  socket.on('create', async () => {
    // console.log(chatRoom.tag);
    //join(방이름) 해당 방이름으로 없다면 생성. 존재하면 입장
    //socket.rooms에 socket.id값과 방이름 확인가능
    socket.join(room);

    //socket은 객체이며 원하는 값을 할당할 수 있음
    socket.room = room;
    // console.log(cookie)
    socket.user = userID;
    // console.log('so', socket);
    console.log('userid', socket.user);
    console.log('room', socket.room);
    let chat_member = await models.Chat_member.findOne({ where: { userid: userID, chatroom_id: chatRoom.id } });
    console.log('mem', chat_member);
    if (!chat_member) {
      await models.Chat_member.create({
        userid: userID,
        chatroom_id: chatRoom.id,
      });
      const chatRoomMember = await models.ChatRoom.findOne({ where: { id: chatRoom.id } });
      chatRoomMember.member += 1;
      await chatRoomMember.save();
    }
    socket.to(socket.room).emit('notice', `${socket.user}님이 입장하셨습니다`, socket.user);
    chatInfo = await models.Chat.findAll({ raw: true, where: { chatroom_id: chatRoom.id } });
    // console.log('info', chatInfo.userid);
    for (let i = 0; i < chatInfo.length; i++) {
      // console.log(i + '번쨰' + chatInfo[i].userid);
      socket.emit('newMessage', chatInfo[i].content, chatInfo[i].userid);
    }
  });

  socket.on('sendMessage', async (message) => {
    console.log('sd', message);
    console.log(chatRoom.id);
    // const userID = jwt.decode(message.userid);
    console.log('id', socket.user);
    const userInfo = await models.Profile.findOne({
      where: { userid: socket.user },
    });

    if (message.message) {
      const userChat = await models.Chat.create({
        chatroom_id: chatRoom.id,
        userid: socket.user,
        content: message.message,
        type: 'u',
        nickname: userInfo.nickname,
      });
    }
    io.to(socket.room).emit('newMessage', message.message, socket.user);
  });

  socket.on('disconnect', async () => {
    console.log(userID + '나감');
    socket.leave(socket.room);
  });
  socket.on('deleteInfo', async () => {
    await models.Chat_member.destroy({
      where: { userid: userID, chatroom_id: chatRoom.id },
    });
    const chatRoomMember = await models.ChatRoom.findOne({ where: { id: chatRoom.id } });
    chatRoomMember.member -= 1;
    await chatRoomMember.save();
  });
};

exports.chat_tag = async (req, res) => {
  let chat_tagArray = [];

  const chat_tag = await models.ChatRoom.findAll({
    where: { tag: req.body.tag },
    order: [['member', 'DESC']],
  });

  for (let i = 0; i < chat_tag.length; i++) {
    chat_tagArray.push({ name: chat_tag[i].name, cover_img: chat_tag[i].cover_img, member: chat_tag[i].member });
  }

  console.log('ds', chat_tagArray);
  res.send({ tag: chat_tagArray });
};
