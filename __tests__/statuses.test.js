import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from './lib/fakeUser';

describe('CRUD', () => {
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
    const login = await server.inject
      .post('/login')
      .body({ email: userData.email, password: userData.password });
    [sessionCookie] = login.cookies;
  });

  it('List', async () => {
    const result = await server
      .inject()
      .get('/statuses')
      .cookies({ session: sessionCookie.value });
    expect(result.statusCode).toBe(302);
  });

  it('Create', async () => {
    await server
      .inject()
      .post('/statuses')
      .body({ name: statusName })
      .cookies({ session: sessionCookie.value });
    const result = server.objection.models.status.findById(1);
    expect(result.name).toBe(statusName);
  });

  it('Update', async () => {
    const newName = faker.lorem.word();
    const status = await server.objection.models.status.insert({ name: statusName });
    await server
      .inject()
      .patch(`/statues/${status.id}`)
      .body({ name: newName })
      .cookies({ session: sessionCookie.value });
    const result = await server.objection.models.status.findById(status.id);
    expect(result.name).toBe(newName);
  });

  it('Delete', async () => {
    const status = await server.objection.models.status.insert({ name: statusName });
    await server
      .inject()
      .delete(`/statuses/${status.id}`)
      .cookies({ session: sessionCookie.value });
    const result = await server.objection.models.status.findById(status.id);
    expect(result).toBeUndefined();
  });
});
