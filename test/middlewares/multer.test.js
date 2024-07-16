const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const multerRouter = require('../../src/middlewares/multer');
const passport = require('../../src/middlewares/auth');

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use('/', multerRouter);

const uploadsDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


describe('Multer Middleware', () => {
  // Create a temporary file to test upload
  const testImagePath = path.join(__dirname, 'image_produk-1721049716512.jpg');
  beforeAll(() => {
    fs.writeFileSync(testImagePath, 'Test image content');
  });

  afterAll(() => {
    fs.unlinkSync(testImagePath);
  });

  it('should block file upload without token', async () => {
    const res = await request(app)
      .post('/uploads')
      .attach('image_produk', testImagePath);

    expect(res.statusCode).toEqual(401); // Assuming unauthorized without valid token
  });

  it('should upload file with valid token', async () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzIxMDk4NjM0LCJleHAiOjE3MjExMDIyMzR9.9Xlv_oBoLXZM6VHGcl-hnJvpifAOzRB8lrwfZYf4D7Y'; // Ganti dengan token JWT yang valid

    const res = await request(app)
      .post('/uploads')
      .set('Authorization', `Bearer ${validToken}`)
      .attach('image_produk', testImagePath);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'File uploaded successfully');
  });
});
