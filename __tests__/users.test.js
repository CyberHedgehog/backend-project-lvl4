import request from 'supertest';
import matchers from 'jest-supertest-matchers';
// import session from 'supertest-session';
import generateFakeUser from '../lib/fakeUser';
import app from '..';
import db from '../models';


beforeAll(async () => {
  await db.sequelize.sync();
  expect.extend(matchers);
});

describe('New user', () => {
  let server;
  const userData = generateFakeUser();

  // beforeAll(async () => {
  //   await db.sequelize.sync();
  //   expect.extend(matchers);
  // });

  beforeEach(() => {
    server = app().listen();
  });

  it('Success', async () => {
    const result = await request.agent(server).post('/users').send(userData);
    expect(result).toHaveHTTPStatus(302);
  });

  it('Failed with same data', async () => {
    const result = await request.agent(server).post('/users').send(userData);
    expect(result).toHaveHTTPStatus(200);
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
    expect(result).toHaveHTTPStatus(200);
  });

  afterAll(async () => {
    // await db.sequelize.close();
  });

  afterEach(async (done) => {
    server.close();
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
    await request.agent(server).post('/login').send({ email, password });
    await request.agent(server).delete(`/users/${secondUser.id}`);
    const result = await db.User.findOne({ where: { id: secondUser.id } });
    expect(result).toBe(null);
  });

  it('Delete without signed user', async () => {
    const newUser = db.User.build(secondUserData);
    await newUser.save();
    await request.agent(server).delete(`/users/${newUser.id}`);
    const result = await db.User.findOne({ where: { id: newUser.id } });
    expect(result).toBe(null);
  });

  afterEach(async (done) => {
    server.close();
    done();
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
