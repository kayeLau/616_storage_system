const path = require('path');
const cookieParser = require('cookie-parser');
const Express = require('express')
const app = Express();
require("reflect-metadata");
import { initializeDatabase } from './data-source';

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

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
const rateLimiter = require('./middleware/rateLimiter')
const helmet = require('helmet')
const log = require("./utils/log");
app.use(auth)
app.use(helmet())
app.use(rateLimiter)
app.use((req, res, next) => {
  const userName = req.userInfo ? req.userInfo.name : '';
  log.info(`${req.method} ${userName} ${req.url} ${JSON.stringify(req.body)}`);
  next();
});

// router
const usersRouter = require('./routes/member');
const shopsRouter = require('./routes/shop')
const productsRouter = require('./routes/product')
const ordersRouter = require('./routes/order')
const settingRouter = require('./routes/setting')
const inventoryRouter = require('./routes/inventory')
const apiRouter = require('./routes/api')
app.use('/member', usersRouter);
app.use('/shop', shopsRouter)
app.use('/product', productsRouter)
app.use('/order', ordersRouter)
app.use('/setting', settingRouter)
app.use('/inventory', inventoryRouter)
app.use('/api', apiRouter)

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500);
  res.json(err)
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

module.exports = app;
