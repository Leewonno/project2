const http = require('http');
const express = require("express");
const SocketIO = require('socket.io');

const app = express();
const PORT = 8000;

const server = http.createServer(app);
const io = SocketIO(server);

require('dotenv').config();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/static/audio', express.static(__dirname + '/audio'));
app.use('/static/img', express.static(__dirname + '/img'));
app.use('/static/css', express.static(__dirname + '/css'));
app.use('/static/js', express.static(__dirname + '/js'));

const socketRouter = require('./router/socket');
socketRouter(io);

const router = require("./router/index");
app.use('/', router);

app.use('/chat', (req, res)=>{
    res.render("chat");
})

server.listen(8000, () => {
    console.log(`http://localhost:${PORT}`);
});