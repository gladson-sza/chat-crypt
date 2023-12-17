const express = require('express');
const { Server } = require('socket.io');
const { User } = require('./models');
const db = require('./models')

const PORT = 8080;
const ADMIN = "Admin";

// state
const UsersState = {
  users: [],
  setUsers: (newUsers) => this.users = newUsers
};

const initExpress = new Promise((resolve, reject) => {
  try {
    const app = express();
    app.use(express.json());
    
    const expressServer = app.listen(PORT,
      () => console.log(`Server started at http://localhost:${PORT}/\nPress Ctrl C to kill the server execution`)
    );

    resolve({
      msg: 'Success',
      expressServer,
      app
    });
  } catch (e) {
    reject({
      msg: 'An error ocurred while initializing express server',
      e
    });
  }
});

const initSocketIo = (expressServer) => {
  const io = new Server(expressServer, {
    cors: {
      origin: [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]
    }
  });
  io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    // Upon connection - only to user 
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat App!"));

    socket.on('enterRoom', ({ name, room }) => {
      // leave previous room 
      const prevRoom = getUser(socket.id)?.room;

      if (prevRoom) {
        socket.leave(prevRoom);
        io.to(prevRoom)
          .emit('message', buildMsg(ADMIN, `${name} has left the room`));
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
      socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`));

      // To everyone else 
      socket.broadcast
        .to(user.room)
        .emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));

      // Update user list for room 
      io.to(user.room)
        .emit('userList', {
          users: getUsersInRoom(user.room)
      });

      // Update rooms list for everyone 
      io.emit('roomList', {
        rooms: getAllActiveRooms()
      });
    });

    // When user disconnects - to all others 
    socket.on('disconnect', () => {
      const user = getUser(socket.id);
      userLeavesApp(socket.id);

      if (user) {
        io.to(user.room)
          .emit('message', buildMsg(ADMIN, `${user.name} has left the room`));

        io.to(user.room)
          .emit('userList', {
            users: getUsersInRoom(user.room)
        });

        io.emit('roomList', {
          rooms: getAllActiveRooms()
        });
      }

      console.log(`User ${socket.id} disconnected`);
    })

    // Listening for a message event 
    socket.on('message', ({ name, text }) => {
      const room = getUser(socket.id)?.room;
      if (room) {
        io.to(room)
          .emit('message', buildMsg(name, text));
      }
    })

    // Listen for activity 
    socket.on('activity', (name) => {
      const room = getUser(socket.id)?.room;
      if (room) {
        socket.broadcast.to(room).emit('activity', name);
      }
    });
  });
};

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

// User functions 
function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ]);
  return user;
};

function userLeavesApp(id) {
  UsersState.setUsers(
    UsersState.users.filter(user => user.id !== id)
  );
};

function getUser(id) {
  return UsersState.users.find(user => user.id === id)
};

function getUsersInRoom(room) {
  return UsersState.users.filter(user => user.room === room)
};

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map(user => user.room)))
};

db.sequelize
  .sync()
  .then((req) => {
    initExpress.then(result => {
      initSocketIo(result.expressServer);
      result.app.get('/createDummyUser', (req, res) => {
        User.create({
          name: 'Dummy',
          email: 'dummy@email.com',
          password: 'password'
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        })
  
        return res.status(200).send('<h1>New insertion<h1>');
      });
    });
});
