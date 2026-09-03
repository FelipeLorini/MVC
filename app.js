const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const env = require('./config/env');
const logger = require('./utils/logger');

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const { attachUser } = require('./middlewares/authMiddleware');
const errorHandler = require('./middlewares/errorHandler');

env.validateEnv();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Suporta PUT/DELETE via ?_method=... (query) ou campo oculto _method (body)
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
  if (req.query && '_method' in req.query) {
    return req.query._method;
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: env.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env.isProduction,
    maxAge: 1000 * 60 * 60 * 4 // 4 horas
  }
}));

app.use(flash());
app.use(attachUser);

app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('error');
  next();
});

app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página não encontrada' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`EventHub rodando em http://localhost:${env.port}`);
});
