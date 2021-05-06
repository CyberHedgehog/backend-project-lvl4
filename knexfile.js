// Update with your config settings.
require('dotenv').config();

const migrations = {
  directory: './server/migrations',
};

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations,
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    migrations,
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    migrations,
    useNullAsDefault: true,
  },
};
