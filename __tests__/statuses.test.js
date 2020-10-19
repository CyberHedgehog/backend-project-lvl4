import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from './lib/fakeUser';

describe('Status', () => {
  let server;
  const userData = generateFakeUser();
  let sessionCookie;
  const statusName = faker.lorem.word();

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
  });

  beforeEach(async () => {
    await server.objection.knex('statuses').truncate();
    const login = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: userData.email,
        password: userData.password,
      },
    });
    [sessionCookie] = login.cookies;
  });

  it('List', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/statuses',
      cookies: { session: sessionCookie.value },
    });
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    await server.inject({
      method: 'POST',
      url: '/statuses',
      payload: { name: statusName },
      cookies: { session: sessionCookie.value },
    });
    const [result] = await server.objection.models.status.query();
    expect(result.name).toBe(statusName);
  });

  it('Update', async () => {
    const newName = faker.lorem.word();
    const status = await server.objection.models.status
      .query()
      .insert({ name: statusName });
    await server.inject({
      method: 'PATCH',
      url: `/statuses/${status.id}`,
      body: { name: newName },
      cookies: { session: sessionCookie.value },
    });
    const result = await server.objection.models.status
      .query()
      .findById(status.id);
    expect(result.name).toBe(newName);
  });

  it('Delete', async () => {
    const status = await server.objection.models.status
      .query()
      .insert({ name: statusName });
    await server
      .inject()
      .delete(`/statuses/${status.id}`)
      .cookies({ session: sessionCookie.value });
    const result = await server.objection.models.status
      .query()
      .findById(status.id);
    expect(result).toBeUndefined();
  });
});
