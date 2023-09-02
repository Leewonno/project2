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

app.use('/audio', express.static('./static/audio'));
app.use('/img', express.static('./static/img'));
app.use('/css', express.static('./static/css'));
app.use('/js', express.static('./static/js'));

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