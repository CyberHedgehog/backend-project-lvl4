import _ from 'lodash';

export default (app) => {
  app.get('/users/new', (request, reply) => {
    reply.render('users/signup');
  });

  app.get('/users', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    reply.render('users/list', { users });
  });

  app.get('/users/edit', { preHandler: app.authCheck }, async (request, reply) => {
    if (request.isSigned) {
      reply.render('users/edit');
      return;
    }
    reply.redirect('/');
  });

  app.post('/users', async (request, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(request.body);
      await app.objection.models.user.query().insert(user);
      reply.redirect('/');
    } catch (e) {
      request.flash('warning', 'Invalid email or password');
      reply.render('users/signup');
    }
  });

  app.delete('/users/:id', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    if (!request.isSigned) {
      reply.render('startPage');
      return;
    }
    try {
      await app.objection.models.user.query().deleteById(request.params.id);
      request.flash('success', 'User deleted successfully');
      reply.redirect('/users');
    } catch (e) {
      request.flash('error', 'Delete error!');
      reply.render('startPage');
    }
  });

  app.patch('/users', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const data = _.omitBy(request.body, (e) => e === 'PATCH' || e === '');
    try {
      const user = await app.objection.models.user
        .query()
        .findById(request.currentUser.id);
      await user.$query().update(data);
      request.flash('success', 'User updated successfuly');
      reply.redirect('users/edit');
    } catch (e) {
      console.log(e);
      request.flash('warning', 'Invalid data');
      reply.redirect('users/edit');
    }
  });
};
