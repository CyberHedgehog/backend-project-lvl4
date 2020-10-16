import getApp from '../server/index';
import generateFakeUser from './lib/fakeUser';

describe('List users', () => {
  const userData = generateFakeUser();
  let server;

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
  });

  it('Not logged', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/users',
    });

    expect(result.statusCode).toBe(302);
  });

  it('Logged', async () => {
    const login = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: userData.email,
        password: userData.password,
      },
    });
    const result = await server.inject({
      method: 'GET',
      url: '/users',
      cookies: { session: login.cookies[0].value },
    });
    expect(result.statusCode).toBe(200);
  });
});

describe('New user', () => {
  let server;
  const userData = generateFakeUser();
  const url = '/users';
  const method = 'POST';

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
  });

  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Registration form', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(response.statusCode).toBe(302);
  });

  it('Success', async () => {
    const response = await server.inject({
      method,
      url,
      payload: userData,
    });
    const users = await server.objection.models.user.query()
      .select('email')
      .where({ email: userData.email });
    expect(response.statusCode).toBe(302);
    expect(users.length).toBe(1);
  });

  it('Failed with same data', async () => {
    await server.inject({
      method,
      url,
      payload: userData,
    });
    const result = await server.inject({
      method,
      url,
      payload: userData,
    });
    expect(result.statusCode).toBe(200);
  });

  it('Failed with wrong data', async () => {
    const { firstName, lastName, password } = userData;
    const wrongUserData = {
      email: 'nonEmail',
      password,
      firstName,
      lastName,
    };
    const result = await server.inject({
      method,
      url,
      payload: wrongUserData,
    });
    expect(result.statusCode).toBe(200);
  });
});

describe('Delete user', () => {
  let server;
  const firstUserData = generateFakeUser();
  const secondUserData = generateFakeUser();
  let user;

  beforeAll(async () => {
    server = await getApp().ready();
    user = server.objection.models.user;
    await server.objection.knex.migrate.latest();
  });

  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Delete with signed user', async () => {
    await user.query().insert(firstUserData);
    const secondUser = await user.query().insert(secondUserData);
    const { email, password } = firstUserData;
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password },
    });
    const resCookies = loginResponse.cookies[0];
    await server.inject({
      method: 'DELETE',
      url: `/users/${secondUser.id}`,
      cookies: { session: resCookies.value },
    });
    const result = await user.query().findById(secondUser.id);
    expect(result).toBeUndefined();
  });

  it('Delete without signed user', async () => {
    const newUser = await user.query().insert(secondUserData);
    await server.inject({
      method: 'DELETE',
      url: `/users/${newUser.id}`,
    });
    const result = await user.query().findById(newUser.id);
    expect(result.email).toBe(newUser.email);
  });
});

describe('Update user', () => {
  let server;
  let user;
  const userData = generateFakeUser();
  const dataToUpdate = generateFakeUser();

  beforeAll(async () => {
    server = await getApp().ready();
    user = server.objection.models.user;
    await server.objection.knex.migrate.latest();
  });

  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Update user', async () => {
    const newUser = await user.query().insert(userData);
    const { email, password } = userData;
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password },
    });
    const [resCookies] = loginResponse.cookies;
    const { firstName, lastName } = dataToUpdate;
    await server.inject({
      method: 'PATCH',
      url: '/users',
      cookies: { session: resCookies.value },
      payload: { firstName, lastName },
    });
    const patсhedUser = await user.query().findById(newUser.id);
    expect(patсhedUser.firstName).toBe(firstName);
  });

  it('Update without auth', async () => {
    const newUser = await user.query().insert(userData);
    const { firstName, lastName } = dataToUpdate;
    await server.inject().patch('/users').body({ firstName, lastName });
    const result = await user.query().findById(newUser.id);
    expect(result.firstName).toBe(newUser.firstName);
  });
});
