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
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket);

      console.log(`Cliente conectado à sala ${roomId}`);
      socket.emit('message', { type: 'connection', message: 'Conectado com sucesso à sala ' + roomId });
    });

    socket.on('message', (data) => {
      try {

        io.to(data.roomId).emit('message', { type: 'chat', message: data.message, userId: data.userId });
      } catch (error) {
        console.error('Erro ao processar a mensagem no servidor:', error);
      }
    });

    socket.on('disconnect', () => {
      rooms.forEach((clients, roomId) => {
        clients.delete(socket);
        console.log(`Cliente desconectado da sala ${roomId}`);
      });
    });
  });
};

module.exports = { initSocketIo };