const { initExpressServer } = require('./expressServer.js');
const { initSocketIo } = require('./webSocket.js');
const db = require('./models');
const { User } = require('./models');

const PORT = 8080;
const ADMIN = "Admin";

db.sequelize
  .sync()
  .then((req) => {
    initExpressServer(PORT).then(result => {
      initSocketIo(result.expressServer, PORT, ADMIN);

      // TODO: Remove this after development stage
      simulateCreateDummyUser(result.app);
    });
});

// TODO: Remove this after development stage
function simulateCreateDummyUser(app) {
  app.get('/createDummyUser', (req, res) => {
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
}
