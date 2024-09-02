const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const petaniRoutes = require("./routes/petaniRoute");
const pembeliRoutes = require("./routes/pembeliRoute");
const produkRoutes = require("./routes/produkRoute");
const transaksiRoutes = require("./routes/transaksiRoute");
const wishlistRoutes = require("./routes/wishlistRoute");
const keranjangRoutes = require("./routes/keranjangRoute");
//
// const errorHandler = require("./middlewares/errorHandler");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
require("dotenv").config();
require("./middlewares/auth");

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Accept", "application/json");
  res.header("Content-Type", "application/json");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/static", express.static(path.join(process.cwd(), "src/tmp/")));
app.use("/transaksi", transaksiRoutes);
app.use("/produk", produkRoutes);
app.use("/petani", petaniRoutes);
app.use("/pembeli", pembeliRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/keranjang", keranjangRoutes);

//test
// Error Handling Middleware
// app.use(errorHandler);

// Export prisma client
// app.set("prisma", prisma);

module.exports = app;
