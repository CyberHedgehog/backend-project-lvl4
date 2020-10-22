import _ from 'lodash';
import i18next from 'i18next';

export default (app) => {
  app.get('/tasks', { preHandler: app.authCheck }, async (request, reply) => {
    const tasks = await app.objection.models.task.query();
    reply.render('tasks/list', { tasks });
  });

  app.get('/tasks/new', { preHandler: app.authCheck }, async (request, reply) => {
    reply.render('tasks/new');
  });

  app.get('/tasks/edit/:id', { preHandler: app.authCheck }, async (request, reply) => {
    const task = app.objection.models.task
      .query()
      .findById(request.params.id);
    reply.render('tasks/edit', task);
  });

  app.post('/tasks', { preHandler: app.authCheck }, async (request, reply) => {
    try {
      await app.objection.models.task.query().insert(request.body);
      request.flash('success', i18next.t('views.pages.tasks.add.success'));
      reply.redirect('/tasks');
    } catch {
      request.flash('error', i18next.t('views.pages.tasks.add.error'));
      reply.redirect('/tasks/new');
    }
  });

  app.patch('/tasks/:id', { preHandler: app.authCheck }, async (request, reply) => {
    const data = _.omitBy(request.body, (e) => e === 'PATCH' || '');
    try {
      await app.objection.models.task
        .query()
        .findById(request.params.id)
        .patch(data);
      request.flash('success', i18next.t('views.pages.tasks.edit.success'));
      reply.redirect('/tasks');
    } catch (e) {
      request.flash('error', i18next('views.pages.tasks.edit.error'));
      reply.redirect('/tasks/edit');
    }
  });

  app.delete('/tasks/:id', { preHandler: app.authCheck }, async (request, reply) => {
    try {
      await app.objection.models.task
        .query()
        .deleteById(request.params.id);
      request.flash('success', i18next.t('views.pages.tasks.delete.success'));
      reply.redirect('/tasks');
    } catch {
      request.flash('error', i18next.t('views.pages.tasks.delete.error'));
      reply.redirect('/tasks');
    }
  });
};
