const { Chat, ChatMember, User } = require('../models');
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
    const response = []

    for (let i = 0; i < chats.length; i++) {
      const c = chats[i]

      const members = await ChatMember.findAll({ where: { chatId: c.id } });
      const idList = members.map(e => e.memberId).filter(e => e !== parseInt(body.currentId))
      const userMembers = await User.findAll({ where: { id: idList } });
      const memberList = userMembers.map(e => e.get({ plain: true }))
      const groupName = getGroupName(memberList)

      response.push({
        id: c.id,
        adminId: c.adminId,
        isGroup: c.isGroup,
        name: groupName
      })
    }

    return res.status(200).send(response);
  } else {
    return res.status(400).send({ message: 'No user found' })
  }
}

const getGroupName = (memberList) => {
  if (memberList.length === 1) {
    return memberList[0].name
  }

  const names = memberList.map(e => e.name)
  console.log(names)
  let gName = ''

  for (let i = 0; i < names.length && i < 3; i++) {
    if (i === 2 || i === (names.length - 1)) {
      gName += `${names[i].split(' ')[0]}`;
    } else {
      gName += `${names[i].split(' ')[0]}, `;
    }
  }

  return gName;
}

module.exports = { createChat, findMyChats }