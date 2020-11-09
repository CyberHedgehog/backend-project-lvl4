import getApp from '../server/index';
import generateFakeUser from '../server/lib/fakeUser';
import getCookies from '../server/lib/getCookies';

const userData = generateFakeUser();
const secondUserData = generateFakeUser();
let server;
let cookies;
let user;

beforeAll(async () => {
  server = await getApp().ready();
  await server.objection.knex.migrate.latest();
  await server.objection.models.user.query().insert(userData);
  user = server.objection.models.user;
  cookies = await getCookies(server, userData);
});

describe('Views', () => {
  it('List logged', async () => {
    const result = await server.inject().get('/users').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('List not logged', async () => {
    const result = await server.inject().get('/users');
    expect(result.statusCode).toBe(302);
  });

  it('New', async () => {
    const result = await server.inject().get('/users/new').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Edit', async () => {
    const result = await server.inject().get('/users/edit').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  // afterAll(() => server.close());
});

describe('New user', () => {
  const url = '/users';
  const method = 'POST';

  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Registration form', async () => {
    const response = await server.inject({
      method: 'GET',
      url,
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
  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Delete with signed user', async () => {
    await user.query().insert(userData);
    const secondUser = await user.query().insert(secondUserData);
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${secondUser.id}`,
      cookies,
    });
    const result = await user.query().findById(secondUser.id);
    expect(response.statusCode).toBe(302);
    expect(result).toBeUndefined();
  });

  it('Delete without signed user', async () => {
    const newUser = await user.query().insert(secondUserData);
    const response = await server.inject({
      method: 'DELETE',
      url: `/users/${newUser.id}`,
    });
    const result = await user.query().findById(newUser.id);
    expect(response.statusCode).toBe(302);
    expect(result.email).toBe(newUser.email);
  });
});

describe('Update user', () => {
  const dataToUpdate = generateFakeUser();

  beforeEach(async () => {
    await server.objection.knex('users').truncate();
  });

  it('Update user', async () => {
    const newUser = await user.query().insert(userData);
    const { firstName, lastName } = dataToUpdate;
    const response = await server.inject({
      method: 'PATCH',
      url: '/users',
      cookies,
      payload: { firstName, lastName },
    });
    const patсhedUser = await user.query().findById(newUser.id);
    expect(response.statusCode).toBe(302);
    expect(patсhedUser.firstName).toBe(firstName);
  });

  it('Update without auth', async () => {
    const newUser = await user.query().insert(userData);
    const { firstName, lastName } = dataToUpdate;
    const response = await server.inject().patch('/users').body({ firstName, lastName });
    const result = await user.query().findById(newUser.id);
    expect(response.statusCode).toBe(302);
    expect(result.firstName).toBe(newUser.firstName);
  });
});

afterAll(() => server.close());
