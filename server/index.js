const { initExpressServer } = require('./expressServer.js');
const { initSocketIo } = require('./webSocket.js');
const db = require('./models');
const { initEndPoints } = require('./endpoints.js');

const PORT = 8080;
const ADMIN = "Admin";

db.sequelize
  .sync()
  .then((_) => {
    initExpressServer(PORT).then(result => {
      initSocketIo(result.expressServer, PORT, ADMIN);
      initEndPoints(result.app)
    });
  });
