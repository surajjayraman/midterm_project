// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const app = express();
const morgan = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();
const dbHelpers = require('./helpers/dbHelpers')(db);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sass({
    src: __dirname + '/styles',
    dest: __dirname + '/public/styles',
    debug: true,
    outputStyle: 'expanded',
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require('./routes/users');
const widgetsRoutes = require('./routes/widgets');
const loginRoutes = require('./routes/login');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use('/api/users', usersRoutes(dbHelpers));
app.use('/api/widgets', widgetsRoutes(db));
app.use('/login', loginRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get('/', (req, res) => {
  // grab the user id from the cookies
  const userId = req.session.user_id;

  console.log({ userId });

  // retrieve the user from the db
  dbHelpers
    .getUserById(userId)
    .then((user) => {
      const templateVars = { user };
      res.render('index', templateVars);
    })
    .catch((err) => console.log(err.message));
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
