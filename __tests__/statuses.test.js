import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from '../server/lib/fakeUser';
import getCookies from '../server/lib/getCookies';

describe('Status', () => {
  let server;
  const userData = generateFakeUser();
  let cookies;
  const statusName = faker.lorem.word();

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
    cookies = await getCookies(server, userData);
  });

  beforeEach(async () => {
    await server.objection.knex('statuses').truncate();
  });

  it('List', async () => {
    const result = await server.inject().get('/statuses').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('New status view', async () => {
    const result = await server.inject().get('/statuses/new').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Edit status view', async () => {
    const newStatus = await server.objection.models.status.query().insert({ name: statusName });
    const result = await server.inject().get(`/statuses/${newStatus.id}/edit`).cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/statuses',
      payload: { name: statusName },
      cookies,
    });
    const [result] = await server.objection.models.status.query();
    expect(response.statusCode).toBe(302);
    expect(result.name).toBe(statusName);
  });

  it('Update', async () => {
    const newStatusName = faker.lorem.word();
    const status = await server.objection.models.status
      .query()
      .insert({ name: statusName });
    const response = await server.inject({
      method: 'PATCH',
      url: `/statuses/${status.id}`,
      body: { name: newStatusName },
      cookies,
    });
    const result = await server.objection.models.status
      .query()
      .findById(status.id);
    expect(response.statusCode).toBe(302);
    expect(result.name).toBe(newStatusName);
  });

  it('Delete', async () => {
    const status = await server.objection.models.status
      .query()
      .insert({ name: statusName });
    const response = await server
      .inject()
      .delete(`/statuses/${status.id}`)
      .cookies(cookies);
    const result = await server.objection.models.status
      .query()
      .findById(status.id);
    expect(response.statusCode).toBe(302);
    expect(result).toBeUndefined();
  });

  afterAll(async () => server.close());
});
