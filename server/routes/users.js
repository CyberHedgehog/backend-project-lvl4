import _ from 'lodash';

export default (app) => {
  app.get('/users/new', (request, reply) => {
    reply.render('users/signup');
  });

  app.get('/users', async (request, reply) => {
    if (request.isSigned) {
      const users = await app.objection.models.user.query();
      reply.render('users/list', { users });
      return;
    }
    reply.redirect('/');
  });

  app.get('/users/edit', async (request, reply) => {
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

  app.delete('/users/:id', async (request, reply) => {
    console.log('ID: ', request.params.id);
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

  app.patch('/users', async (request, reply) => {
    if (!request.isSigned) {
      reply.render('startPage');
      return;
    }
    const data = _.omitBy(request.body, (e) => e === 'PATCH' || e === '');
    console.log(data);
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
