const controller = require('../controller/chat.controller');

module.exports = function (io) {
  io.on('connection', (socket) => {
    controller.connection(io, socket);
  });
};
