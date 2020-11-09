import faker from 'faker';
import getApp from '../server/index';
import generateFakeUser from '../server/lib/fakeUser';
import getCookies from '../server/lib/getCookies';

describe('Tasks', () => {
  const firstUserData = generateFakeUser();
  const secondUserData = generateFakeUser();
  let server;
  let firstUser;
  let secondUser;
  let status;
  let task;
  let cookies;

  beforeAll(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
    firstUser = await server.objection.models.user
      .query()
      .insert(firstUserData);
    secondUser = await server.objection.models.user
      .query()
      .insert(secondUserData);
    status = await server.objection.models.status
      .query()
      .insert({ name: 'in progress' });
    task = server.objection.models.task;
    cookies = await getCookies(server, firstUserData);
  });

  beforeEach(async () => {
    await server.objection.knex('tasks').truncate();
  });

  it('List', async () => {
    const result = await server.inject({
      method: 'GET',
      url: '/tasks',
      cookies,
    });
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    const payload = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      executorId: secondUser.id,
    };
    const response = await server.inject({
      method: 'POST',
      url: '/tasks',
      payload,
      cookies,
    });
    const [result] = await task.query().where({ name: payload.name });
    expect(response.statusCode).toBe(302);
    expect(result.description).toBe(payload.description);
  });

  it('Update', async () => {
    const taskData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      creatorId: firstUser.id,
      executorId: secondUser.id,
    };
    const newTask = await task.query().insert(taskData);
    const newDescription = faker.lorem.words();
    const response = await server.inject({
      method: 'PATCH',
      url: `/tasks/${newTask.id}`,
      payload: { ...taskData, description: newDescription },
      cookies,
    });
    const result = await task.query().findById(newTask.id);
    expect(response.statusCode).toBe(302);
    expect(result.description).toBe(newDescription);
  });

  it('Delete', async () => {
    const taskData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      creatorId: firstUser.id,
      executor: secondUser.id,
    };
    const newTask = await task.query().insert(taskData);
    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/${newTask.id}`,
      cookies,
    });
    const result = await task.query().findById(newTask.id);
    expect(response.statusCode).toBe(302);
    expect(result).toBeUndefined();
  });

  it('Only creator can delete', async () => {
    const taskData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      creatorId: secondUser.id,
      executor: firstUser.id,
    };

    const newTask = await task.query().insert(taskData);

    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/${newTask.id}`,
      cookies,
    });

    const result = await task.query().findById(newTask.id);
    expect(response.statusCode).toBe(302);
    expect(result).toBeDefined();
  });

  afterAll(async () => server.close());
});
