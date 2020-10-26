import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from '../server/lib/fakeUser';

describe('Label', () => {
  let server;
  const labelName = faker.lorem.word();
  const userData = generateFakeUser();
  let cookies;

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    await server.objection.models.user.query().insert(userData);
    const login = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: userData.email,
        password: userData.password,
      },
    });
    cookies = login.cookies;
  });

  it('List', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/labels',
      cookies: { session: cookies.value },
    });
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    await server.inject({
      method: 'POST',
      url: '/labels',
      payload: { name: labelName },
      cookies: { session: cookies.value },
    });

    const [result] = await server.objection.models.lable.query();
    expect(result.name).toBe(labelName);
  });

  it('Update', async () => {
    const newName = faker.lorem.word();
    const label = await server.objection.models.label
      .query()
      .insert({ name: labelName });
    await server.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: { name: newName },
      cookies: { session: cookies.value },
    });
    const result = await server.objection.models.label
      .query()
      .findById(label.id);
    expect(result.name).toBe(newName);
  });

  it('Delete', async () => {
    const label = await server.objection.models.label
      .query()
      .insert({ name: labelName });
    await server.inject({
      method: 'GET',
      url: `/labels/${label.id}`,
      cookies: { session: cookies.value },
    });
    const result = await server.objection.models.label
      .query()
      .findById(label.id);
    expect(result).toBeUndefined();
  });
});
