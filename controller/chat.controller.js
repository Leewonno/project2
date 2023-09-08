const jwt = require('jsonwebtoken');
const models = require('../database/db');
const roomList = [];

let room;
let chatRoom;

exports.chat = async (req, res) => {
  room = req.query.room;
  console.log(room);
  chatRoom = await models.ChatRoom.findOne({
    where: { name: room },
  });

  // console.log(chatRoom.tag);
  res.render('chat');
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
  socket.on('create', (userNick) => {
    // console.log(chatRoom.tag);
    //join(방이름) 해당 방이름으로 없다면 생성. 존재하면 입장
    //socket.rooms에 socket.id값과 방이름 확인가능
    socket.join(room);

    //socket은 객체이며 원하는 값을 할당할 수 있음
    socket.room = room;
    socket.user = jwt.decode(userNick).nickname;
    console.log('nick', socket.user);
    console.log('room', socket.room);

    socket.to(room).emit('notice', `${socket.user}님이 입장하셨습니다`, socket.user);

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

  socket.on('sendMessage', (message) => {
    console.log(message);
    io.to(socket.room).emit('newMessage', message.message, message.nick, false);
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
