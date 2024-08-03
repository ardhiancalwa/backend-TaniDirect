const cors = require('cors');

const corsOptions = {
  origin: '*',
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const corsMiddleware = cors(corsOptions);
// console.log("cors jalan");

module.exports = corsMiddleware;