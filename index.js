const http = require('http');
const express = require('express');
const SocketIO = require('socket.io');
const expressLayouts = require('express-ejs-layouts');
const db = require('./database/db');

const app = express();
const PORT = 8000;

const server = http.createServer(app);
const io = SocketIO(server);

require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use('/audio', express.static('./static/audio'));
app.use('/img', express.static('./static/img'));
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

const socketRouter = require('./router/socket');
socketRouter(io);

const appRouter = require('./router/app.router');
const userRouter = require('./router/user.router');
const songRouter = require('./router/song.router');
const playlistRouter = require('./router/playlist.router');
const playRouter = require('./router/play.router');
app.use('/', appRouter);
app.use('/', userRouter);
app.use('/', songRouter);
app.use('/', playlistRouter);
app.use('/', playRouter);

app.use('/chat', (req, res) => {
  res.render('chat');
});

db.sequelize.sync({ force: false }).then(() => {
  server.listen(8000, () => {
    console.log(`http://localhost:${PORT}`);
  });
});