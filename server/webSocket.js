const { Server } = require('socket.io');

const rooms = new Map();

const initSocketIo = (expressServer, port, admin) => {
  const io = new Server(expressServer, {
    cors: {
      origin: [`http://localhost:${port}`, `http://127.0.0.1:${port}`, 'http://localhost:5173', 'https://localhost:5173']
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, { clients: new Set(), messages: [] });
      }

      rooms.get(roomId).clients.add(socket);

      console.log(`Cliente conectado à sala ${roomId}`)

      rooms.get(roomId).clients.add(socket);

      socket.emit('message', { type: 'history', messages: rooms.get(roomId).messages });

      socket.emit('message', { type: 'connection', message: 'Conectado com sucesso à sala ' + roomId });
    });

    socket.on('message', (data) => {
      try {
        const roomId = data.roomId;
        const messageData = { type: 'chat', message: data.message, userId: data.userId, userName: data.userName };

        rooms.get(roomId).messages.push(messageData);
        io.to(roomId).emit('message', messageData);
      } catch (error) {
        console.error('Erro ao processar a mensagem no servidor:', error);
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((room, roomId) => {
        if (room.clients.has(socket)) {
          room.clients.delete(socket);
          console.log(`Cliente desconectado da sala ${roomId}`);
        }
      });
    });
  });
};

module.exports = { initSocketIo };
