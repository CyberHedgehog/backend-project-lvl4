import knex from 'knex';
import knexConfig from '../server/knexfile';
import app from '../server';
import generateFakeUser from '../server/lib/fakeUser';

describe('New user', () => {
  let server;
  const userData = generateFakeUser();
  const url = '/users';
  const method = 'POST';

  beforeAll(async () => {
    const db = knex(knexConfig.test);
    await db.migrate.latest();
    console.log(app);
    // const user = await User.fromJson(userData);
    // await User.query().insert(user);
  });

  beforeEach(() => {
    server = app;
  });

  it('Registration form', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/new',
    });
    expect(response.statusCode).toBe(200);
  });

  it('Success', async () => {
    const response = await server.inject({
      method,
      url,
      payload: userData,
    });
    expect(response.statusCode).toBe(302);
  });

  it('Failed with same data', async () => {
    const result = await server.inject({
      method,
      url,
      payload: userData,
    });
    expect(result.statusCode).toBe(200);
  });

  it('Failed with wrong data', async () => {
    const { firstName, lastName, password } = userData;
    const wrongUserData = {
      email: 'nonEmail',
      password,
      firstName,
      lastName,
    };
    const result = await request.agent(server).post('/users').send(wrongUserData);
    expect(result.statusCode).toBe(200);
  });

  afterEach(async (done) => {
    // server.close();
    done();
  });
});

describe('Delete user', () => {
  let server;
  const firstUserData = generateFakeUser();
  const secondUserData = generateFakeUser();

  beforeEach(() => {
    server = app().listen();
  });

  it('Delete with signed user', async () => {
    const firstUser = db.User.build(firstUserData);
    await firstUser.save();
    const secondUser = db.User.build(secondUserData);
    await secondUser.save();
    const { email, password } = firstUserData;
    const agent = request.agent(server);
    await agent.post('/login').send({ email, password });
    await agent.delete(`/users/${secondUser.id}`);
    const result = await db.User.findOne({ where: { id: secondUser.id } });
    expect(result).toBeNull();
  });

  it('Delete without signed user', async () => {
    const newUser = db.User.build(secondUserData);
    await newUser.save();
    await request.agent(server).delete(`/users/${newUser.id}`);
    const result = await db.User.findOne({ where: { id: newUser.id } });
    expect(result).not.toBeNull();
  });

  afterEach(async (done) => {
    server.close();
    done();
  });
});

describe('Update user', () => {
  let server;
  const userData = generateFakeUser();
  const dataToUpdate = generateFakeUser();

  beforeEach(() => {
    server = app().listen();
  });

  it('Update own data', async () => {
    const user = db.User.build(userData);
    await user.save();

    const { email, password } = userData;
    const agent = request.agent(server);
    await agent.post('/login').send({ email, password });
    const { firstName, lastName } = dataToUpdate;
    await agent.patch('/users').send({ firstName, lastName });
    await agent.delete('/session');
    const patсhedUser = await db.User.findOne({ where: { id: user.id } });

    expect(patсhedUser.firstName).toBe(firstName);
  });

  it('Update without auth', async () => {
    const user = await db.User.findOne({ where: { email: userData.email } });
    const agent = request.agent(server);
    const { firstName, lastName } = dataToUpdate;
    await agent.patch('/users').send({ firstName, lastName });
    const result = await db.User.findOne({ where: { id: user.id } });

    expect(result.firstName).toBe(user.firstName);
  });

  afterEach(async () => {
    server.close();
  });
});
