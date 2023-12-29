const { initExpressServer } = require('./expressServer.js');
const { initSocketIo } = require('./webSocket.js');
const { Op } = require("sequelize");
const db = require('./models');
const { User } = require('./models');
const CryptoJS = require("crypto-js");

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

const isEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

const toDatabasePassword = (password, createdAt) => {
  return CryptoJS.SHA512(`${password}${createdAt}`).toString()
}

const findUserWithEmailAndPassword = async (email, password) => {
  let user = await User.findOne({ where: { email: email } })
  if (user !== null) {
    let dbPassword = toDatabasePassword(password, user.createdAt)
    if (dbPassword === user.password) return user
  }

  return null
}

const initRoutes = (app) => {
  app.post('/user', async (req, res) => {
    const body = req.body

    if (isEmpty(body)) {
      return res.status(400).send({ message: 'Empty request body' })
    }

    if (body.name === undefined) {
      return res.status(400).send({ message: "Missing \"name\" property" })
    }

    if (body.email === undefined) {
      return res.status(400).send({ message: "Missing \"email\" property" })
    }

    if (body.password === undefined) {
      return res.status(400).send({ message: "Missing \"password\" property" })
    }

    let user = await User.findOne({ where: { email: body.email } })
    if (user === null) {
      user = await User.create({
        name: body.name,
        email: body.email,
        password: body.password
      })

      user = await User.findOne({ where: { email: body.email, password: body.password } })
      user.password = toDatabasePassword(user.password, user.createdAt)
      await user.save()

      return res.status(200).send({
        'id': user.id,
        'name': user.name,
        'email': user.email
      });
    } else {
      return res.status(400).send({ message: 'User already exists' })
    }
  })

  app.post('/login', async (req, res) => {
    const body = req.body

    if (isEmpty(body)) {
      return res.status(400).send({ message: 'Empty request body' })
    }

    if (body.email === undefined) {
      return res.status(400).send({ message: "Missing \"email\" property" })
    }

    if (body.password === undefined) {
      return res.status(400).send({ message: "Missing \"password\" property" })
    }

    let user = await findUserWithEmailAndPassword(body.email, body.password)
    if (user !== null) {
      return res.status(200).send({
        'id': user.id,
        'name': user.name,
        'email': user.email
      });
    } else {
      return res.status(400).send({ message: 'Wrong email or password' })
    }
  })

  app.post('/contact/add', async (req, res) => {
    const body = req.body

    if (isEmpty(body)) {
      return res.status(400).send({ message: 'Empty request body' })
    }

    if (body.email === undefined) {
      return res.status(400).send({ message: "Missing \"email\" property" })
    }

    let user = await User.findOne({ where: { email: body.email } })
    if (user !== null) {
      return res.status(200).send({
        'id': user.id,
        'name': user.name,
        'email': user.email
      });
    } else {
      return res.status(404).send({ message: 'User not found' })
    }
  })

  app.get('/contacts/search', async (req, res) => {
    const query = req.query.q

    if (isEmpty(query)) {
      return res.status(400).send({ message: 'Empty request body' })
    }

    let users = await User.findAll({
      where: {
        name: { [Op.like]: `%${query}%` }
      }
    })
    if (users !== null) {
      return res.status(200).send(users.map(e => {
        return {
          'id': e.id,
          'name': e.name,
          'email': e.email
        }
      }));
    } else {
      return res.status(400).send({ message: 'No user found' })
    }
  })
}