import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';
import generateFakeUser from '../lib/fakeUser';
import app from '..';
import db from '../models';

const firstUserData = generateFakeUser();
const secondUserData = generateFakeUser();
let server;

beforeAll(async () => {
  await db.sequelize.sync();
  expect.extend(matchers);
  server = app().listen();
  await request.agent(server).post('/users').send(firstUserData);
  await request.agent(server).post('/users').send(secondUserData);
});

describe('Tasks', () => {
  const { email, password } = firstUserData;
  const taskTitle = faker.random.word();
  const taskBody = faker.random.words();

  it('Get tasks list', async () => {
    const agent = request.agent(server);
    await agent.post('/login').send({ email, password });
    const response = await agent.get('/tasks');
    expect(response).toHaveHTTPStatus(200);
  });

  it('Create task', async () => {
    const agent = request.agent(server);
    const secondUser = await db.User.findOne({ where: { firstName: secondUserData.firstName } });
    await agent.post('/login').send({ email, password });
    const response = await agent.post('/tasks/new').send({ name: taskTitle, description: taskBody, assignedTo: secondUser.id });
    const result = await db.Task.findOne({ where: { name: taskTitle } });
    expect(response).toHaveHTTPStatus(302);
    expect(result.name).toBe(taskTitle);
  });

  it('Delete task', async () => {
    const agent = request.agent(server);
    const firstUser = await db.User.findOne({ where: { firstName: firstUserData.firstName } });
    const task = new db.Task({
      name: taskTitle,
      description: taskBody,
      creatorId: firstUser.id,
      assignedUserId: firstUser.id,
    });
    await task.save();
    await agent.post('/login').send({ email, password });
    await agent.delete(`/tasks/${task.id}`);
    const result = await db.Task.findOne({ where: { id: task.id } });
    expect(result).toBeNull();
  });

  it('Update task', async () => {
    const agent = request.agent(server);
    const task = await db.Task.create({
      name: taskTitle,
      description: taskBody,
    });
    await task.reload();
    const newBody = faker.random.words();
    await agent.post('/login').send({ email, password });
    await agent.patch(`/tasks/${task.id}`).send({ description: newBody });
    await task.reload();
    expect(task.description).toBe(newBody);
  });

  afterEach(async (done) => {
    server.close();
    done();
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
