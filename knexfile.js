// Update with your config settings.
const migrations = {
  directory: './server/migrations',
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
    connection: process.env.DATABASE_URL,
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
