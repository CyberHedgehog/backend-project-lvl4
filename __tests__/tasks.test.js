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

  it('Create task', async () => {
    const agent = request.agent(server);
    const firstUser = await db.User.findOne({ where: { firstName: firstUserData.firstName } });
    const secondUser = await db.User.findOne({ where: { firstName: secondUserData.firstName } });
    await agent.post('/login').send({ email, password });
    await agent.post('/task').send({ name: taskTitle, description: taskBody, assignedTo: secondUser.id });
    const result = await db.Task.findOne({ where: { name: taskTitle } });
    const expectedData = {
      name: taskTitle,
      description: taskBody,
      creatorId: firstUser.id,
      assignedUserId: secondUser.id,
    };
    expect(result).toEqual(expect.objectContaining(expectedData));
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
    await agent.delete(`/task/${task.id}`).send({ email, password });
    const result = await db.Task.findOne({ where: { id: task.id } });
    expect(result).toBeNull();
  });

  afterEach(async (done) => {
    server.close();
    done();
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
