import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from '../server/lib/fakeUser';
import getCookies from '../server/lib/getCookies';

describe('Label', () => {
  let server;
  const labelName = faker.lorem.word();
  const userData = generateFakeUser();
  let cookies;

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
    cookies = await getCookies(server, userData);
  });

  beforeEach(async () => {
    await server.objection.knex('labels').truncate();
  });

  it('List', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/labels',
      cookies,
    });
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    await server.inject({
      method: 'POST',
      url: '/labels',
      payload: { name: labelName },
      cookies,
    });

    const [result] = await server.objection.models.label.query();
    expect(result.name).toBe(labelName);
  });

  it('Update', async () => {
    const newLabelName = faker.lorem.word();
    const label = await server.objection.models.label
      .query()
      .insert({ name: labelName });
    await server.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: { name: newLabelName },
      cookies,
    });
    const result = await server.objection.models.label
      .query()
      .findById(label.id);
    expect(result.name).toBe(newLabelName);
  });

  it('Delete', async () => {
    const label = await server.objection.models.label
      .query()
      .insert({ name: labelName });
    await server.inject({
      method: 'DELETE',
      url: `/labels/${label.id}`,
      cookies,
    });
    const result = await server.objection.models.label
      .query()
      .findById(label.id);
    expect(result).toBeUndefined();
  });

  afterAll(async () => server.close());
});
