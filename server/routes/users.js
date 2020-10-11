export default (app) => {
  app.get('/users/new', { name: 'new' }, (req, reply) => {
    reply.view('users/signup');
  });

  app.post('/users', async (request, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(request.body);
      await app.objection.models.user.query().insert(user);
      reply.redirect('/root');
    } catch (e) {
      reply.view('/users/new', { message: e });
    }
  });

  app.delete('/users/:id', async (request, reply) => {
    if (!request.isSigned) {
      reply.view('startPage');
      return;
    }
    try {
      await app.objection.models.user.query().deleteById(request.id);
    } catch (e) {
      reply.view('startPage');
    }
    reply.redirect('/');
  });

  app.patch('/users', async (request, reply) => {
    if (!request.isSigned) {
      reply.view('startPage');
      return;
    }
    try {
      const user = await app.objection.models.user
        .query()
        .findById(request.currentUser.id);
      await user.$query().update(request.body);
      reply.redirect('startPage');
    } catch (e) {
      reply.view('startPage');
    }
  });
};
