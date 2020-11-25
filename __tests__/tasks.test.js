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
  let newTask;

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
    const taskData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      creatorId: firstUser.id,
      executorId: secondUser.id,
    };
    newTask = await task.query().insert(taskData);
  });

  it('List', async () => {
    const result = await server.inject().get('/tasks').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('New task view', async () => {
    const result = await server.inject().get('/tasks/new').cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Edit task view', async () => {
    const result = await server.inject().get(`/tasks/${newTask.id}/edit`).cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Get task view', async () => {
    const result = await server.inject().get(`/tasks/${newTask.id}`).cookies(cookies);
    expect(result.statusCode).toBe(200);
  });

  it('Create', async () => {
    const taskData = {
      name: faker.lorem.word(),
      description: faker.lorem.words(),
      statusId: status.id,
      executorId: secondUser.id,
    };
    const response = await server.inject({
      method: 'POST',
      url: '/tasks',
      payload: { task: taskData },
      cookies,
    });
    const [result] = await task.query().where({ name: taskData.name });
    expect(response.statusCode).toBe(302);
    expect(result.description).toBe(taskData.description);
  });

  it('Update', async () => {
    const newDescription = faker.lorem.words();
    const response = await server.inject({
      method: 'PATCH',
      url: `/tasks/${newTask.id}`,
      payload: { task: { ...newTask, description: newDescription } },
      cookies,
    });
    const result = await task.query().findById(newTask.id);
    expect(response.statusCode).toBe(302);
    expect(result.description).toBe(newDescription);
  });

  it('Delete', async () => {
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
    cookies = await getCookies(server, secondUser);
    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/${newTask.id}`,
      cookies,
    });

    const result = await task.query().findById(newTask.id);
    expect(response.statusCode).toBe(302);
    expect(result).toBeDefined();
  });

  afterAll(() => server.close());
});
