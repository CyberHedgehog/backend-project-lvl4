import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import generateFakeUser from '../lib/fakeUser';
import app from '..';
import db from '../models';

describe('Sessions', () => {
  let server;
  const userData = generateFakeUser();

  beforeAll(async () => {
    await db.sequelize.sync();
    const user = db.User.build(userData);
    await user.save();
    expect.extend(matchers);
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('new', async () => {
    const { email, password } = userData;
    const result = await request.agent(server).post('/login').send({ email, password });
    const cookie = result.res.headers['set-cookie'];
    expect(cookie).toBeDefined();
    expect(result).toHaveHTTPStatus(302);
  });

  it('Failed login', async () => {
    const { email } = userData;
    const result = await request.agent(server).post('/login').send({ email, password: 'wrongPassword' });
    expect(result).toHaveHTTPStatus(200);
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
