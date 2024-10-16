const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// require('./models/create_tabel')
const Express = require('express')
const app = Express();
require("reflect-metadata");
import { initializeDatabase } from './data-source';

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(Express.json());
app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());



const startApp = async () => {
    await initializeDatabase();
};
startApp();

// middleware
const auth = require('./middleware/auth')
// const rateLimiter = require('./middleware/rateLimiter')
// const helmet = require('helmet')
app.use(auth)
// app.use(helmet())
// app.use(rateLimiter)

// router
const usersRouter = require('./routes/member');
const shopsRouter = require('./routes/shop')
const productsRouter = require('./routes/product')
const ordersRouter = require('./routes/order')
const settingRouter = require('./routes/setting')
const inventoryRouter = require('./routes/inventory')
app.use('/member', usersRouter);
app.use('/shop',shopsRouter)
app.use('/product',productsRouter)
app.use('/order',ordersRouter)
app.use('/setting',settingRouter)
app.use('/inventory',inventoryRouter)

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
