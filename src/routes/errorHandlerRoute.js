const express = require('express');
const errorHandler = require('../../src/middlewares/errorHandler');

const app = express();

app.get('/error', (req, res, next) => {
  const err = new Error('Test Error');
  next(err);
});

// Middleware errorHandler harus dipasang setelah semua rute lainnya
app.use(errorHandler);

module.exports = app;
