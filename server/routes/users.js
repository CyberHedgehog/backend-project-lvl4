export default (app) => {
  app.get('/users/new', { name: 'new' }, (request, reply) => {
    // console.log(request.flash);
    reply.render('users/signup');
  });

  app.post('/users', async (request, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(request.body);
      await app.objection.models.user.query().insert(user);
      reply.redirect('/');
    } catch (e) {
      request.flash('warning', e);
      reply.render('users/signup');
    }
  });

  app.delete('/users/:id', async (request, reply) => {
    if (!request.isSigned) {
      reply.render('startPage');
      return;
    }
    try {
      await app.objection.models.user.query().deleteById(request.id);
    } catch (e) {
      reply.render('startPage');
    }
    reply.redirect('/');
  });

  app.patch('/users', async (request, reply) => {
    if (!request.isSigned) {
      reply.render('startPage');
      return;
    }
    try {
      const user = await app.objection.models.user
        .query()
        .findById(request.currentUser.id);
      await user.$query().update(request.body);
      reply.redirect('startPage');
    } catch (e) {
      reply.render('startPage');
    }
  });
};
