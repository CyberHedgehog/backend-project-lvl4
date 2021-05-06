import i18next from 'i18next';

export default (app) => {
  app.get('/users/new', { name: 'signup' }, (request, reply) => {
    reply.render('users/signup');
  });

  app.get('/users', { name: 'users', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    reply.render('users/list', { users });
  });

  app.get('/users/:id/edit', { name: 'editUser', preHandler: app.authCheck }, async (request, reply) => {
    const userId = request.session.get('userId');
    if (parseInt(request.params.id, 10) !== userId) {
      request.flash('error', i18next.t('views.pages.users.edit.notAllowed'));
      reply.redirect(app.reverse('users'));
    }
    try {
      const user = await app.objection.models.user.query().findById(request.params.id);
      reply.render('users/edit', { user });
    } catch {
      request.flash('error', i18next.t('views.pages.users.edit.error'));
      reply.redirect(app.reverse('users'));
    }
  });

  app.post('/users', { name: 'addUser' }, async (request, reply) => {
    try {
      const user = await app.objection.models.user.fromJson(request.body.user);
      await app.objection.models.user.query().insert(user);
      reply.redirect(app.reverse('root'));
    } catch (e) {
      app.log.info(e);
      request.flash('error', 'Invalid email or password');
      reply.render('users/signup');
    }
  });

  app.delete('/users/:id', { name: 'deleteUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const userId = request.session.get('userId');
    if (parseInt(request.params.id, 10) !== userId) {
      request.flash('error', i18next.t('views.pages.users.delete.error.notAllowed'));
      reply.redirect(app.reverse('users'));
    }
    try {
      const assignedTasks = await app.objection.models.user.relatedQuery('assignedTasks').for(request.params.id);
      const createdTasks = await app.objection.models.user.relatedQuery('createdTasks').for(request.params.id);
      if (createdTasks.length > 0 || assignedTasks.length > 0) {
        request.flash('error', i18next.t('views.pages.users.delete.error.hasTasks'));
      } else {
        await app.objection.models.user.query().deleteById(request.params.id);
        request.flash('success', i18next.t('views.pages.users.delete.success'));
        request.session.delete();
        reply.redirect(app.reverse('root'));
      }
    } catch (e) {
      request.flash('error', i18next.t('views.pages.users.delete.error.deleteError'));
    }
    reply.redirect(app.reverse('users'));
  });

  app.patch('/users/:id', { name: 'updateUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const userId = request.session.get('userId');
    if (parseInt(request.params.id, 10) !== userId) {
      request.flash('error', i18next.t('views.pages.users.edit.noAllowed'));
      reply.redirect(app.reverse('users'));
    }

    try {
      const user = await app.objection.models.user
        .query()
        .findById(request.currentUser.id);
      await user.$query().update(request.body.user);
      request.flash('success', 'User updated successfuly');
      reply.redirect(app.reverse('editUser', { id: request.params.id }));
    } catch (e) {
      request.flash('error', 'Invalid data');
      reply.redirect(app.reverse('editUser', { id: request.params.id }));
    }
  });
};
