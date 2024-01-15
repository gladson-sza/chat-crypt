const { User, PendenceExchange } = require('../models');
const { isEmpty } = require("./util");

const updateKey = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  if (body.publicKey === undefined) {
    return res.status(400).send({ message: "Missing \"publicKey\" property" })
  }

  const user = await User.findOne({ where: { id: body.currentId } })
  user.publicKey = body.publicKey
  await user.save()

  return res.status(200).send({ message: 'Public Key update' })
}

const createExchangeRequest = async (req, res) => {
  const body = req.body
  const { currentId, sendList, key, chatId } = body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  if (sendList === undefined) {
    return res.status(400).send({ message: "Missing \"sendList\" property" })
  }

  if (key === undefined) {
    return res.status(400).send({ message: "Missing \"key\" property" })
  }

  if (key === undefined) {
    return res.status(400).send({ message: "Missing \"chatId\" property" })
  }

  const receivers = sendList.map(e => parseInt(e))
  const bulkList = receivers.map(e => {
    return {
      requesterId: e,
      senderId: currentId,
      chatId: chatId,
      key: key,
    }
  })

  const result = await PendenceExchange.bulkInsert(bulkList)

  if (result !== null) {
    return res.status(200).send({ message: 'Exchange request created' })
  } else {
    return res.status(500).send({ message: 'Server couldn\'t create exchange' })
  }

}

const getPedingExchanges = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.currentId === undefined) {
    return res.status(400).send({ message: "Missing \"currentId\" property" })
  }

  const result = await PendenceExchange.findAll({
    where: {
      requesterId: body.currentId
    }
  })

  if (result !== null) {
    return res.status(200).send(result)
  } else {
    return res.status(500).send({ message: 'Server couldn\'t create exchange' })
  }
}

const confirmExchange = async (req, res) => {
  const body = req.body

  if (isEmpty(body)) {
    return res.status(400).send({ message: 'Empty request body' })
  }

  if (body.exchangeId === undefined) {
    return res.status(400).send({ message: "Missing \"exchangeId\" property" })
  }

  PendenceExchange.destroy({
    where: {
      id: body.exchangeId,
    },
  }).then((rowsDeleted) => {
    if (rowsDeleted === 1) {
      return res.status(200).send({ message: "Exchange confirmed" })
    } else {
      return res.status(400).send({ message: "Exchange not exists" })
    }
  }).catch((_) => {
    return res.status(500).send({ message: "Exchange cannot be confirmed, try again" })
  });


}

module.exports = { updateKey, createExchangeRequest, getPedingExchanges, confirmExchange }