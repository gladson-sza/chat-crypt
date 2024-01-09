const { initExpressServer } = require('./expressServer.js');
const { initSocketIo } = require('./webSocket.js');
const db = require('./models');

const { createUser, login } = require('./service/authService.js')
const { addContact, searchContact, searchMyContacts, findMyContacts } = require('./service/contactService.js')

const PORT = 8080;
const ADMIN = "Admin";

db.sequelize
  .sync()
  .then((_) => {
    initExpressServer(PORT).then(result => {
      initSocketIo(result.expressServer, PORT, ADMIN);
      initRoutes(result.app)
    });
  });

const initRoutes = (app) => {
  app.get('/', async (req, res) => {
    return res.status(200).send('<p>Server Online!<p>')
  })

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

  app.post('/contacts/search', async (req, res) => {
    const result = await searchContact(req, res)
    return result
  })

  app.post('/contacts/my/', async (req, res) => {
    const result = await findMyContacts(req, res)
    return result
  })

  app.post('/contacts/my/search', async (req, res) => {
    const result = await searchMyContacts(req, res)
    return result
  })
}