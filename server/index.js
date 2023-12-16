const app = require('express')()
const PORT = 8080

app.listen (
  PORT,
  () => console.log(`The server has started! http://localhost:${PORT}`)
)