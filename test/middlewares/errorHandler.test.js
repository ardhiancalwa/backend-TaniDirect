const request = require('supertest');
const express = require('express');
const errorHandler = require('../../src/middlewares/errorHandler');

const app = express();

app.get('/error', (req, res, next) => {
  const err = new Error('Test Error');
  next(err);
});

app.use(errorHandler);

describe('Error Handler Middleware', () => {
  it('should return error response', async () => {
    const res = await request(app).get('/error');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Test Error');
  });
});
