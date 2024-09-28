const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// require('./models/create_tabel')
const app = express();
require("reflect-metadata");

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// middleware
const auth = require('./middleware/auth')
const rateLimiter = require('./middleware/rateLimiter')
const helmet = require('helmet')
app.use(auth)
app.use(helmet())
app.use(rateLimiter)

// router
const usersRouter = require('./routes/users');
const shopsRouter = require('./routes/shops')
const productsRouter = require('./routes/product')
const ordersRouter = require('./routes/order')
const settingRouter = require('./routes/setting')
app.use('/users', usersRouter);
app.use('/shops',shopsRouter)
app.use('/products',productsRouter)
app.use('/orders',ordersRouter)
app.use('/setting',settingRouter)

// ws
require('./utils/ws')

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(500);
  res.json(err)
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

module.exports = app;
