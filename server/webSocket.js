const { Server } = require('socket.io');
const {
  activateUser, getUser, userLeavesApp,
  getUsersInRoom, getAllActiveRooms 
} = require('./state/usersState.js');

const initSocketIo = (expressServer, port, admin) => {
  const io = new Server(expressServer, {
    cors: {
      origin: [`http://localhost:${port}`, `http://127.0.0.1:${port}`, 'http://localhost:5173', 'https://localhost:5173']
    }
  });
  io.on('connection', onUserConnection(io, admin));
};

// Upon connection - only to user 
const onUserConnection = (io, admin) => socket => {
  console.log(`User ${socket.id} connected`);

  socket.emit('message', buildMsg(admin, 'Bem vindo!'));

  socket.on('enterRoom', onEnterRoom(io, socket, admin));

  socket.on('disconnect', onUserDisconnection(io, socket, admin))

  socket.on('message', (message) => {
    console.log('Received message:', message);
    io.emit('message', message);
  })

  socket.on('activity', onActivity(socket));
}

const onEnterRoom = (io, socket, admin) => ({ name, room }) => {
  // leave previous room 
  const prevRoom = getUser(socket.id)?.room;

  if (prevRoom) {
    socket.leave(prevRoom);
    io.to(prevRoom)
      .emit('message', buildMsg(admin, `${name} has left the room`));
  }

  const user = activateUser(socket.id, name, room);

  // Cannot update previous room users list until after the state update in activate user 
  if (prevRoom) {
    io.to(prevRoom)
      .emit('userList', {
        users: getUsersInRoom(prevRoom)
    });
  }

  // join room 
  socket.join(user.room);

  // To user who joined 
  socket.emit('message', buildMsg(admin, `You have joined the ${user.room} chat room`));

  // To everyone else 
  socket.broadcast
    .to(user.room)
    .emit('message', buildMsg(admin, `${user.name} has joined the room`));

  // Update user list for room 
  io.to(user.room)
    .emit('userList', {
      users: getUsersInRoom(user.room)
  });

  // Update rooms list for everyone 
  io.emit('roomList', {
    rooms: getAllActiveRooms()
  });
}

// When user disconnects - to all others 
const onUserDisconnection = (io, socket, admin) => () => {
  const user = getUser(socket.id);
  userLeavesApp(socket.id);

  if (user) {
    io.to(user.room)
      .emit('message', buildMsg(admin, `${user.name} has left the room`));

    io.to(user.room)
      .emit('userList', {
        users: getUsersInRoom(user.room)
    });

    io.emit('roomList', {
      rooms: getAllActiveRooms()
    });
  }

  console.log(`User ${socket.id} disconnected`);
}

// Listening for a message event 
const onMessage = (io, socket) => ({ name, text }) => {
  const room = getUser(socket.id)?.room;
  if (room) {
    io.to(room)
      .emit('message', buildMsg(name, text));
  }
}

// Listen for activity 
const onActivity = (socket) =>  name => {
  const room = getUser(socket.id)?.room;
  if (room) {
    socket.broadcast.to(room).emit('activity', name);
  }
}

function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format(new Date())
  };
};

module.exports = { initSocketIo };