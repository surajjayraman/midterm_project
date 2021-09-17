module.exports = (db) => {
  const getUserById = (id) => {
    const queryText = {
      text: `SELECT * FROM USERS WHERE id = $1`,
      values: [id],
    };

    console.log('getUserById');
    return db
      .query(queryText)
      .then((data) => {
        console.log(data.rows);

        const user = data.rows[0];
        return user;
      })
      .catch((err) => console.log({ err: err.message }));
  };

  const getUsers = () => {
    return db
      .query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        return users;
      })
      .catch((err) => {
        console.log(`Err: ${err.message}`);
      });
  };

  const getWidgetsByUser = (id) => {
    const queryText = {
      text: `SELECT users.id AS user_id, users.name AS user_name, widgets.id AS widget_id, widgets.name as widget_name FROM USERS
             INNER JOIN widgets
             ON users.id = widgets.user_id
             WHERE users.id = $1
             `,
      values: [id],
    };

    return db
      .query(queryText)
      .then((data) => {
        return data.rows;
      })
      .catch((err) => console.log({ err: err.message }));
  };

  return {
    getUserById,
    getUsers,
    getWidgetsByUser,
  };
};
