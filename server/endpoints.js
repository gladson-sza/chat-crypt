
const { createUser, login } = require('./service/authService.js')
const { addContact, searchContact, searchMyContacts, findMyContacts } = require('./service/contactService.js');
const { updateKey, createExchangeRequest, getPedingExchanges, confirmExchange } = require('./service/cryptService.js');
const { createChat, findMyChats } = require('./service/chatService.js')

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

  app.post('/contacts/my', async (req, res) => {
    const result = await findMyContacts(req, res)
    return result
  })

  app.post('/contacts/my/search', async (req, res) => {
    const result = await searchMyContacts(req, res)
    return result
  })

  app.post('/chat', async (req, res) => {
    const result = await createChat(req, res)
    return result
  })

  app.post('/chat/my', async (req, res) => {
    const result = await findMyChats(req, res)
    return result
  })

  app.post('/key', async (req, res) => {
    const result = await updateKey(req, res)
    return result
  })

  app.post('/key/confirm', async (req, res) => {
    const result = await confirmExchange(req, res)
    return result
  })

  app.post('/key/send', async (req, res) => {
    const result = await createExchangeRequest(req, res)
    return result
  })

  app.post('/key/get', async (req, res) => {
    const result = await getPedingExchanges(req, res)
    return result
  })
}

module.exports = { initEndPoints }