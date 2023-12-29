const { User } = require('../models');
const { Op } = require("sequelize");

const addContact = async (req, res) => {
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
}

const searchContact = async (req, res) => {
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
}

module.exports = { addContact, searchContact }