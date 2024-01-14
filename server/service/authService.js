const CryptoJS = require("crypto-js");
const { User } = require('../models');
const { isEmpty } = require("./util");

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

const createUser = async (req, res) => {
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

    return res.status(204).send({
      'id': user.id,
      'name': user.name,
      'email': user.email
    });
  } else {
    return res.status(400).send({ message: 'User already exists' })
  }
}

const login = async (req, res) => {
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
}

module.exports = { createUser, login }