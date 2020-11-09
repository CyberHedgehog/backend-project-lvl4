import getApp from '../server/index';

describe('Requests', () => {
  let server;
  beforeAll(() => {
    server = getApp();
  });

  it('200', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });
    expect(response.statusCode).toBe(200);
  });

  it('404', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/wrongpath',
    });
    expect(response.statusCode).toBe(404);
  });

  afterAll(() => server.close());
});
