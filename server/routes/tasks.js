import _ from 'lodash';
import i18next from 'i18next';

export default (app) => {
  app.get('/tasks', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const tasks = await app.objection.models.task
      .query()
      .select(
        'tasks.*',
        'status.name as statusName',
        'description',
        'creator.firstName as creatorFirstName',
        'creator.lastName as creatorLastName',
        'executor.firstName as executorFirstName',
        'executor.lastName as executorLastName',
      )
      .join('statuses as status', 'tasks.statusId', 'status.id')
      .join('users as creator', 'tasks.creatorId', 'creator.id')
      .join('users as executor', 'tasks.executorId', 'executor.id');
    reply.render('tasks/list', { tasks });
  });

  app.get('/tasks/new', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    reply.render('tasks/new', { users, statuses });
  });

  app.get('/tasks/edit/:id', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const task = await app.objection.models.task
      .query()
      .findById(request.params.id);
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    reply.render('tasks/edit', { task, users, statuses });
  });

  app.post('/tasks', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const { body } = request;
    const data = {
      name: body.name,
      description: body.description,
      creatorId: request.currentUser.id,
      statusId: parseInt(body.statusId, 10),
      executorId: parseInt(body.executorId, 10),
    };
    try {
      await app.objection.models.task.query().insert(data);
      request.flash('success', i18next.t('views.pages.tasks.add.success'));
      reply.redirect('/tasks');
    } catch (e) {
      request.log.error(e);
      request.flash('error', i18next.t('views.pages.tasks.add.error'));
      reply.redirect('/tasks/new');
    }
  });

  app.patch('/tasks/:id', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const filteredData = _.omitBy(request.body, (e) => e === 'PATCH' || '');
    const data = {
      ...filteredData,
      executorId: _.parseInt(filteredData.executorId),
      statusId: _.parseInt(filteredData.statusId),
    };
    try {
      await app.objection.models.task
        .query()
        .findById(request.params.id)
        .patch(data);
      request.flash('success', i18next.t('views.pages.tasks.edit.success'));
      reply.redirect('/tasks');
    } catch (e) {
      request.flash('error', i18next.t('views.pages.tasks.edit.error'));
      reply.redirect(`/tasks/edit/${request.params.id}`);
    }
  });

  app.delete('/tasks/:id', { preHandler: (...args) => app.authCheck(...args) }, async (request, reply) => {
    const targetTask = await app.objection.models.task.query().findById(request.params.id);
    if (request.currentUser.id !== targetTask.creatorId) {
      request.flash('error', i18next.t('views.pages.tasks.delete.notOwnerError'));
      reply.redirect('/tasks');
      return;
    }
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
