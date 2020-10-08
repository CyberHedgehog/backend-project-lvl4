import getApp from '../server';
import generateFakeUser from './lib/fakeUser';

describe('Sessions', () => {
  let server;
  const userData = generateFakeUser();

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
  });

  it('view', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/login',
    });
    expect(result.statusCode).toBe(200);
  });

  it('new', async () => {
    const { email, password } = userData;
    const result = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password },
    });
    console.log(result.headers);
    const cookie = result.headers['set-cookie'];
    expect(cookie).toBeDefined();
    expect(result.statusCode).toBe(302);
  });

  it('Failed login', async () => {
    const { email } = userData;
    const result = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email, password: 'wrongPassword' },
    });
    const cookie = result.headers['set-cookie'];
    expect(cookie).not.toBeDefined();
    expect(result.statusCode).toBe(200);
  });
});
