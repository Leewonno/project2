const jwt = require('jsonwebtoken');
const models = require('../database/db');
const roomList = [];

let room;
let chatRoom;
let userID;
let Rname;
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
  res.send({ userid: Rname });
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
  socket.on('create', () => {
    // console.log(chatRoom.tag);
    //join(방이름) 해당 방이름으로 없다면 생성. 존재하면 입장
    //socket.rooms에 socket.id값과 방이름 확인가능
    socket.join(room);

    //socket은 객체이며 원하는 값을 할당할 수 있음
    socket.room = room;
    // console.log(cookie)
    socket.user = userID;
    // console.log('so', socket);
    userID = socket.user;
    console.log('userid', socket.user);
    console.log('room', socket.room);

    socket.to(socket.room).emit('notice', `${socket.user}님이 입장하셨습니다`, socket.user);

    //채팅방 목록 갱신
    // if (!roomList.includes(roomName)) {
    //   roomList.push(roomName);
    //   //갱신된 목록은 전체가 봐야함
    //   io.emit('roomList', roomList);
    // }
    // const usersInRoom = getUsersInRoom(roomName);
    // io.to(roomName).emit('userList', usersInRoom);
    // cb();
  });

  socket.on('sendMessage', async (message) => {
    console.log('sd', message);
    console.log(chatRoom.id);
    // const userID = jwt.decode(message.userid);
    console.log('id', socket.user);
    const userInfo = await models.Profile.findOne({
      where: { userid: socket.user },
    });
    const userChat = await models.Chat.create({
      chatroom_id: chatRoom.id,
      userid: socket.user,
      content: message.message,
      type: 'u',
      nickname: userInfo.nickname,
    });
    io.to(socket.room).emit('newMessage', message.message, socket.user);
  });

  socket.on('disconnect', () => {
    if (socket.room) {
      socket.leave(socket.room);
    }
  });

  function getUsersInRoom(room) {
    const users = [];
    //채팅룸에 접속한 socket.id값을 찾아야함
    const clients = io.sockets.adapter.rooms.get(room);
    //console.log(clients);
    if (clients) {
      clients.forEach((socketId) => {
        //io.sockets.sockets: socket.id가 할당한 변수들의 객체값
        const userSocket = io.sockets.sockets.get(socketId);
        //개별 사용자에게 메세지를 보내기 위해서 객체형태로 변경
        //key: 소켓아이디, name:이름
        const info = { name: userSocket.user, key: socketId };
        users.push(info);
      });
    }
    return users;
  }
};
