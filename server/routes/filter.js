export default (app) => {
  app.post('/filter', async (req, reply) => {
    console.log(req.body);
    req.session.set('filter', req.body);
    reply.redirect('/tasks');
  });

  app.delete('/filter', async (req, reply) => {
    req.session.set('filter', null);
    reply.redirect('/tasks');
  });
};
