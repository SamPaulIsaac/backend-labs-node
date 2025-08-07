// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      user: "root",
      password: "r00t",
      database: "node_student_db",
    },
    migrations: {
      directory: "./migrations",
    },
  },
};
