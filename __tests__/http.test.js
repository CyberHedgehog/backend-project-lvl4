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

  // it('302', async () => {
  //   const result = await request.agent(server).delete('/session');
  //   expect(result).toHaveHTTPStatus(302);
  // });

  afterEach(() => {
    server.close();
  });
});
