const controller = require('../controller/socket');

module.exports = function (io) {
    io.on('connection', (socket) => {
        controller.connection(io, socket);
    });
};
