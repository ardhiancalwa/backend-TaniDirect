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
const errorHandler = require("./middlewares/errorHandler");
const corsConfig = require("./middlewares/cors")
// const corsMiddleware = require('./middlewares/cors');
require("dotenv").config();
require("./middlewares/auth");

const app = express();

// Middleware
// const corsOptions = {
//   origin: ["http://localhost:3000", "http://another-allowed-origin.com"], // Allow all origins or specify your frontend URL
//   optionsSuccessStatus: 200,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));
// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// // Ensure handling of preflight requests
// app.options("*", cors(corsOptions));

// app.use((req, res, next) => {
//   res.header(
//     req.header("Access-Control-Allow-Origin", "*"),
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

// const corsOptions = {
//   origin: 'http://:3000', // specify the origin you want to allow
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));

// // Middleware untuk menangani preflight requests
// app.options('*', cors(corsOptions));

// // Middleware untuk menambahkan header
// app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', req.header('Origin'));
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

// app.use(cors({
//   origin: "*",
// }));
// app.use(cors({
//   origin: '*', // specify the origin you want to allow
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true // allow credentials
// }));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
//   next();
// });

app.options('*', cors());

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  req.header("Access-Control-Allow-Origin", "*")
  // res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Accept', 'application/json');
  res.header('Content-Type', 'application/json');
  next()
});

// app.use(corsConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// }, express.static(path.join(__dirname, 'uploads')));
app.use("/static", express.static(path.join(process.cwd(), "src/tmp/")));
// app.use("/static", express.static(path.join(__dirname, "../public")));
app.use("/transaksi", transaksiRoutes);
app.use("/produk", produkRoutes);
app.use("/petani", petaniRoutes);
app.use("/pembeli", pembeliRoutes);

//test
// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
