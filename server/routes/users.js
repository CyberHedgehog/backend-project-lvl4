import _ from 'lodash';

export default (app) => {
  app.get('/users/new', { name: 'signup' }, (request, reply) => {
    reply.render('users/signup');
  });

  app.get('/users', { name: 'users', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    reply.render('users/list', { users });
  });

  app.get('/users/edit', { name: 'editUser', preHandler: app.authCheck }, async (request, reply) => {
    if (request.isSigned) {
      reply.render('users/edit');
      return;
    }
    reply.redirect(app.reverse('root'));
  });

  app.post('/users', { name: 'addUser' }, async (request, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(request.body);
      await app.objection.models.user.query().insert(user);
      reply.redirect(app.reverse('root'));
    } catch (e) {
      request.flash('error', 'Invalid email or password');
      reply.render('users/signup');
    }
  });

  app.delete('/users/:id', { name: 'deleteUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    if (!request.isSigned) {
      reply.render('startPage');
      return;
    }
    try {
      await app.objection.models.user.query().deleteById(request.params.id);
      request.flash('success', 'User deleted successfully');
      reply.redirect(app.reverse('users'));
    } catch (e) {
      request.flash('error', 'Delete error!');
      reply.render('startPage');
    }
  });

  app.patch('/users', { name: 'updateUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const data = _.omitBy(request.body, (e) => e === 'PATCH' || e === '');
    try {
      const user = await app.objection.models.user
        .query()
        .findById(request.currentUser.id);
      await user.$query().update(data);
      request.flash('success', 'User updated successfuly');
      reply.redirect(app.reverse('editUser'));
    } catch (e) {
      request.flash('error', 'Invalid data');
      reply.redirect(app.reverse('editUser'));
    }
  });
};
