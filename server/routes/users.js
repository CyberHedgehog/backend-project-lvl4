export default (app) => {
  app.get('/users/new', { name: 'new' }, (req, reply) => {
    reply.view('users/signup');
  });
  app.post('/users', async (req, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(req.body);
      await app.objection.models.user.query().insert(user);
      reply.redirect('/root');
    } catch (e) {
      reply.view('/users/new', { message: e });
    }
  });
};
