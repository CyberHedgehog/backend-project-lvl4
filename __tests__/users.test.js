import getApp from '../server/index';
import generateFakeUser from './lib/fakeUser';

describe('New user', () => {
  let server;
  const userData = generateFakeUser();
  const url = '/users';
  const method = 'POST';

  beforeEach(async () => {
    server = await getApp().ready();
    await server.objection.knex.migrate.latest();
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
    const users = await server.objection.models.user.query()
      .select('email')
      .where({ email: userData.email });
    expect(response.statusCode).toBe(302);
    expect(users.length).toBe(1);
  });

  it('Failed with same data', async () => {
    await server.inject({
      method,
      url,
      payload: userData,
    });
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
    const result = await server.inject({
      method,
      url,
      payload: wrongUserData,
    });
    expect(result.statusCode).toBe(200);
  });
});

// describe('Delete user', () => {
//   let server;
//   const firstUserData = generateFakeUser();
//   const secondUserData = generateFakeUser();
//   let user;

//   beforeAll(async () => {
//     server = await getApp().ready();
//     user = server.objection.models.user;
//   })

//   beforeEach(async () => {
//     await server.objection.knex.migrate.latest();
//   });

//   it('Delete with signed user', async () => {
//     const firstUser = await user.query().insert(firstUserData);
//     const secondUser = await user.query().insert(secondUserData);
//     const { email, password } = firstUserData;
//     await server.inject({
//       method: 'POST',
//       url: '/users'
//     })
//     await agent.post('/login').send({ email, password });
//     await agent.delete(`/users/${secondUser.id}`);
//     const result = await db.User.findOne({ where: { id: secondUser.id } });
//     expect(result).toBeNull();
//   });

//   it('Delete without signed user', async () => {
//     const newUser = db.User.build(secondUserData);
//     await newUser.save();
//     await request.agent(server).delete(`/users/${newUser.id}`);
//     const result = await db.User.findOne({ where: { id: newUser.id } });
//     expect(result).not.toBeNull();
//   });

//   afterEach(async (done) => {
//     server.close();
//     done();
//   });
// });

// describe('Update user', () => {
//   let server;
//   const userData = generateFakeUser();
//   const dataToUpdate = generateFakeUser();

//   beforeEach(() => {
//     server = app().listen();
//   });

//   it('Update own data', async () => {
//     const user = db.User.build(userData);
//     await user.save();

//     const { email, password } = userData;
//     const agent = request.agent(server);
//     await agent.post('/login').send({ email, password });
//     const { firstName, lastName } = dataToUpdate;
//     await agent.patch('/users').send({ firstName, lastName });
//     await agent.delete('/session');
//     const patсhedUser = await db.User.findOne({ where: { id: user.id } });

//     expect(patсhedUser.firstName).toBe(firstName);
//   });

//   it('Update without auth', async () => {
//     const user = await db.User.findOne({ where: { email: userData.email } });
//     const agent = request.agent(server);
//     const { firstName, lastName } = dataToUpdate;
//     await agent.patch('/users').send({ firstName, lastName });
//     const result = await db.User.findOne({ where: { id: user.id } });

//     expect(result.firstName).toBe(user.firstName);
//   });

//   afterEach(async () => {
//     server.close();
//   });
// });
