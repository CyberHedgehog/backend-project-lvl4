import getApp from '../server';
import generateFakeUser from '../server/lib/fakeUser';

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
    const { location } = result.headers;
    expect(location).toBe('/login');
    expect(result.statusCode).toBe(302);
  });

  it('Delete', async () => {
    const login = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email: userData.email, password: userData.password },
    });
    const cookie = login.cookies[0];

    const result = await server.inject({
      method: 'DELETE',
      url: '/session',
      cookies: { session: cookie.value },
    });
    expect(result.statusCode).toBe(302);
    expect(result.cookies[0].value).toBe('');
  });

  afterAll(() => server.close());
});
