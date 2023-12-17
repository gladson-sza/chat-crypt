
const express = require('express')
const app = express()
const PORT = 8080

const db = require('./models')

const { User } = require('./models')

db.sequelize.sync().then((req) => {
  app.use(express.json())
  app.listen(
    PORT,
    () => console.log(`Server started at http://localhost:${PORT}/\nPress Ctrl C to kill the server execution`)
  )

  app.get('/createDummyUser', (req, res) => {
    User.create({
      name: 'Dummy',
      email: 'dummy@email.com',
      password: 'password'
    }).catch((err) => {
      if (err) {
        console.log(err)
      }
    })

    return res.status(200).send('<h1>New insertion<h1>')
  })
})
