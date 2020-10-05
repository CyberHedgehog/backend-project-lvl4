import app from '../server/index';

describe('Requests', () => {
  let server;
  beforeEach(() => {
    server = app;
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

  afterEach(() => {
    server.close();
  });
});
