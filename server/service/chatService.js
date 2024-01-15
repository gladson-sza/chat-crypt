const { Chat, ChatMember } = require('../models');
const { isEmpty } = require("./util");

const createChat = async (req, res) => {
  const body = req.body
  const currentId = body.currentId
  const contactIds = body.contactIds

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  if (contactIds === undefined) {
    return res.status(400).send({ message: "Missing \"contactIds\" property" })
  }

  if (contactIds.length === 0) {
    return res.status(400).send({ message: "\"contactIds\" property cannot be empty" })
  }

  contactIds.push(parseInt(currentId))

  const chat = await Chat.create({
    isGroup: contactIds.length > 2,
    adminId: currentId,
    name: ''
  })

  if (chat !== null) {
    const bulkMembers = contactIds.map(e => {
      return {
        chatId: chat.id,
        memberId: e
      }
    })

    await ChatMember.bulkCreate(bulkMembers)

    return res.status(200).send({
      'message': 'Chat created successfully',
      'chatId': chat.id
    });
  } else {
    return res.status(500).send({ message: 'The server couldn\'t create a new chat' })
  }
}

const findMyChats = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  const chats = await Chat.findAll({
    include: [
      {
        model: ChatMember,
        as: 'Member',
        where: { memberId: body.currentId },
        attributes: []
      }
    ]
  });

  if (chats !== null) {
    return res.status(200).send(chats.map(e => {
      return e
    }));
  } else {
    return res.status(400).send({ message: 'No user found' })
  }
}

module.exports = { createChat, findMyChats }