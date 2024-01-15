const { User, Contact, sequelize, Sequelize } = require('../models');
const { Op } = require("sequelize");
const { isEmpty } = require("./util");

const addContact = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.contactId === undefined) {
    return res.status(400).send({ message: "Missing \"contactId\" property" })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  let contact = await Contact.findOne({
    where: {
      userId: body.currentId,
      contactId: body.contactId
    }
  })

  if (contact !== null) {
    return res.status(400).send({ message: "Contact already added" })
  }

  let searchContact = await User.findOne({ where: { id: body.contactId } })

  if (searchContact !== null) {
    await Contact.create({
      userId: body.currentId,
      contactId: body.contactId,
    })

    await Contact.create({
      userId: body.contactId,
      contactId: body.currentId,
    })

    return res.status(200).send({
      'name': searchContact.name,
      'email': searchContact.email
    });
  } else {
    return res.status(404).send({ message: 'Contact not found' })
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
      email: { [Op.like]: `${query}%` },
      id: { [Op.not]: `${body.currentId}` }
    }
  })

  if (users !== null) {
    let contacts = await Contact.findAll({
      where: {
        userId: body.currentId
      },
      include: [{
        model: User,
        as: 'User'
      }],
    })

    if (contacts !== null) {
      // users = users.filter(e => users.includes(contacts))
    }

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

  let contacts = await Contact.findAll({
    where: {
      userId: body.currentId
    },
    include: [{
      model: User,
      as: 'User'
    }],
  })

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

  let contacts = await Contact.findAll({
    where: {
      userId: body.currentId
    },
    include: [{
      model: User,
      as: 'User'
    }],
  })

  if (contacts !== null) {
    return res.status(200).send(contacts.map(e => {
      return {
        'id': e.User.id,
        'name': e.User.name,
        'email': e.User.email,
        'publicKey': e.User.publicKey
      }
    }));
  } else {
    return res.status(400).send({ message: 'No user found' })
  }
}

module.exports = { addContact, searchContact, searchMyContacts, findMyContacts }