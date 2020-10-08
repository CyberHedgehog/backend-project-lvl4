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

  app.delete('/users/:id', async (req, reply) => {
    const currentUserId = req.session.get('userId');
    console.log(currentUserId);
    if (!currentUserId) {
      reply.view('root');
      return;
    }
    try {
      await app.objection.models.user.query().deleteById(req.id);
      reply.redirect('/users');
    } catch (e) {
      reply.view('root');
    }
  });
};
