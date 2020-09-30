export default (app) => {
  app.get('/', { name: 'root' }, (req, reply) => {
    reply.view('startPage', { text: 'Hello from route!' });
  });
};
