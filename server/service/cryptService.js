const { User } = require('../models');
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

module.exports = { updateKey }