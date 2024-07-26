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
const kategoriRoutes = require('./routes/kategoriRoute');
const produkRoutes = require('./routes/produkRoute');
const promoRoutes = require('./routes/promoRoute');
const transaksiRoutes = require('./routes/transaksiRoute');
const errorHandler = require('./middlewares/errorHandler');
const corsMiddleware = require('./middlewares/cors');
require('dotenv').config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(corsMiddleware);
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
app.use('/transaksi', transaksiRoutes);
app.use('/promo', promoRoutes);
app.use('/produk', produkRoutes);
app.use('/kategori', kategoriRoutes);
app.use('/petani', petaniRoutes);
app.use('/pembeli', pembeliRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
