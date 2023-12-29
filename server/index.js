const { initExpressServer } = require('./expressServer.js');
const { initSocketIo } = require('./webSocket.js');
const db = require('./models');

const { createUser, login } = require('./service/authService.js')
const { addContact, searchContact } = require('./service/contactService.js')

const PORT = 8080;
const ADMIN = "Admin";

db.sequelize
  .sync()
  .then((req) => {
    initExpressServer(PORT).then(result => {
      initSocketIo(result.expressServer, PORT, ADMIN);
      initRoutes(result.app)
    });
  });

const initRoutes = (app) => {
  app.post('/user', async (req, res) => {
    const result = await createUser(req, res)
    return result
  })

  app.post('/login', async (req, res) => {
    const result = await login(req, res)
    return result
  })

  app.post('/contact/add', async (req, res) => {
    const result = await addContact(req, res)
    return result
  })

  app.get('/contacts/search', async (req, res) => {
    const result = await searchContact(req, res)
    return result
  })
}