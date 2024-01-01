const { User, Contact, sequelize } = require('../models');
const { Op } = require("sequelize");

const addContact = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.email === undefined) {
    return res.status(400).send({ message: "Missing \"email\" property" })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  let searchContact = await User.findOne({ where: { email: body.email } })

  if (searchContact !== null) {
    await Contact.create({
      userId: currentId,
      contactId: searchContact.id,
    })

    await Contact.create({
      userId: searchContact.id,
      contactId: currentId,
    })

    return res.status(200).send({
      'name': searchContact.name,
      'email': searchContact.email
    });
  } else {
    return res.status(404).send({ message: 'User not found' })
  }
}

const searchContact = async (req, res) => {
  const query = req.query.q
  const body = req.body

  if (isEmpty(query)) {
    return res.status(400).send({ message: 'Empty query' })
  }

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  let users = await User.findAll({
    where: {
      email: { [Op.like]: `%${query}%`, [Op.not]: `${body.currentId}` }
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

const searchMyContacts = async (req, res) => {
  const query = req.query.q
  const body = req.body

  if (isEmpty(query)) {
    return res.status(400).send({ message: 'Empty query' })
  }

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  let contacts = await sequelize.query(sql`SELECT * FROM Users U JOIN Contacts C on U.id = C.contactId WHERE (email LIKE %${query}% OR name LIKE %${query}%) AND (id <> ${body.currentId})`);

  if (contacts !== null) {
    return res.status(200).send(contacts.map(e => {
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

const findMyContacts = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  let contacts = await sequelize.query(sql`SELECT * FROM Users U JOIN Contacts C on U.id = C.contactId WHERE (id <> ${body.currentId})`);

  if (contacts !== null) {
    return res.status(200).send(contacts.map(e => {
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

module.exports = { addContact, searchContact, searchMyContacts, findMyContacts }