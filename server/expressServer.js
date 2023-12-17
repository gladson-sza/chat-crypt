const express = require('express');

const initExpressServer = (port) => new Promise((resolve, reject) => {
  try {
    const app = express();
    app.use(express.json());
    
    const expressServer = app.listen(port,
      () => console.log(`Server started at http://localhost:${port}/\nPress Ctrl C to kill the server execution`)
    );

    resolve({
      msg: 'Success',
      expressServer,
      app
    });
  } catch (e) {
    reject({
      msg: 'An error ocurred while initializing express server',
      e
    });
  }
});

module.exports = { initExpressServer };