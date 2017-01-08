const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app); //Instead of app we now using server (express also uses same behind the scene)
var io = socketIO(server);  //listen events through io

app.use(express.static(publicPath));

io.on('connection', (socket) => {  //Listen for events on server (only for connection or to emit to all we use io else we use socket)
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room name are required');
    }

    socket.join(params.room);
    // socket.leave('The Office Fans');

    //io.emit -> io.to(roomName).emit
    //socket.broadcast.emit -> socket.broadcast.to(roomName).emit
    //socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));    //This will emit to only the client himself
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`)); //emit to all clients except the sender

    callback();
  });

  socket.on('createMessage', (message, callback) => {   //emit for emitter and on for listener; so this will listen from client
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));   //emit to all clients
    callback();
  });

  socket.on('createLocationMessage', (coords)=> {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect',()=> {
    console.log('User was disconnected');
  });
});


server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
