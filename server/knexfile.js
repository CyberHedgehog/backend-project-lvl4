// Update with your config settings.
const migrations = {
  directory: './migrations',
};

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite',
    },
    migrations,
    useNullAsDefault: true,
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations,
    useNullAsDefault: true,
  },

  test: {
    client: 'sqlite3',
    connection: ':memory:',
    migrations: { directory: './server/migrations' },
    useNullAsDefault: true,
  },
};
