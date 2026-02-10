require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const MongoDBStore = require('connect-mongodb-session')(session);

// Routers
const loginRouter = require('./views/login');
const signupRouter = require('./views/signup');
const userRouter = require('./views/rabc/handleUser');
const googleRouter = require('./views/google');
const githubRouter = require('./views/github');
const logoutRouter = require('./views/logout');
const roleRouter = require('./views/rabc/handleRole');
const permissionRouter = require('./views/rabc/handlePermission');
const logRouter = require('./views/rabc/handleLog');

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/* ---------------- SESSION STORE (FIXED) ---------------- */

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,          // ✅ FIX HERE
  collection: 'sessions',                // simple & safe
  // connectionOptions: {
  //    // Force IPv4 to fix querySrv ECONNREFUSED
  // }
});

store.on('error', (error) => {
  console.error('❌ Session store error:', error);
});

/* ---------------- SESSION CONFIG ---------------- */

app.set('trust proxy', 1);

app.use(session({
  name: 'erp-rbac.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production', // ✅ local + prod safe
    maxAge: 1000 * 60 * 60 * 24 * 180
  }
}));

/* ---------------- PASSPORT ---------------- */

app.use(passport.initialize());
app.use(passport.session());

const User = require('./schema/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* ---------------- ROUTES ---------------- */

app.use('/api/login', loginRouter);
app.use('/api/signup', signupRouter);
app.use('/api/user', userRouter);
app.use('/api/auth/google', googleRouter);
app.use('/api/auth/github', githubRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/role', roleRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/log', logRouter);

/* ---------------- TEST ---------------- */

app.get('/', (req, res) => {
  res.send('✅ ERP RBAC Server Running');
});

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
