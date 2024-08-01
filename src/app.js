const express = require('express');
const path = require('path'); 
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const petaniRoutes = require('./routes/petaniRoute');
const pembeliRoutes = require('./routes/pembeliRoute'); 
const produkRoutes = require('./routes/produkRoute');
const transaksiRoutes = require('./routes/transaksiRoute');
const errorHandler = require('./middlewares/errorHandler');
const corsMiddleware = require('./middlewares/cors');
require('dotenv').config();
require('./middlewares/auth');

const app = express();

// Middleware
app.use(corsMiddleware);
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));
app.use('/transaksi', transaksiRoutes);
app.use('/produk', produkRoutes);
app.use('/petani', petaniRoutes);
app.use('/pembeli', pembeliRoutes);

//test
// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
