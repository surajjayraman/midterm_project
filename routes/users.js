/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (dbHelpers) => {
  router.get('/', (req, res) => {
    dbHelpers
      .getUsers()
      .then((users) => res.json({ users }))
      .catch((err) => res.json({ err: err.message }));
  });

  router.get('/:id/widgets', (req, res) => {
    dbHelpers
      .getWidgetsByUser(req.params.id)
      .then((widgets) => res.json({ widgets }))
      .catch((err) => res.json({ err: err.message }));
  });

  return router;
};
