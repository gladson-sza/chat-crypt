
const { createUser, login } = require('./service/authService.js')
const { addContact, searchContact, searchMyContacts, findMyContacts } = require('./service/contactService.js');
const { updateKey } = require('./service/cryptService.js');

const initEndPoints = (app) => {
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

  app.post('/key', async (req, res) => {
    const result = await updateKey(req, res)
    return result
  })
}

module.exports = { initEndPoints }