import _ from 'lodash';
import i18next from 'i18next';

export default (app) => {
  app.get('/tasks', { preHandler: app.authCheck }, async (request, reply) => {
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

  app.get('/tasks/new', { preHandler: app.authCheck }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    reply.render('tasks/new', { users, statuses });
  });

  app.get('/tasks/edit/:id', { preHandler: app.authCheck }, async (request, reply) => {
    const task = await app.objection.models.task
      .query()
      .findById(request.params.id);
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    reply.render('tasks/edit', { task, users, statuses });
  });

  app.post('/tasks', { preHandler: app.authCheck }, async (request, reply) => {
    const { body } = request;
    const data = {
      name: body.name,
      description: body.description,
      creatorId: parseInt(body.creatorId, 10),
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

  app.patch('/tasks/:id', { preHandler: app.authCheck }, async (request, reply) => {
    const filterdData = _.omitBy(request.body, (e) => e === 'PATCH' || '');
    const data = {
      name: filterdData.name,
      description: filterdData.description,
      statusId: parseInt(filterdData.statusId, 10),
      executorId: parseInt(filterdData.executorId, 10),
    };
    try {
      await app.objection.models.task
        .query()
        .findById(request.params.id)
        .patch(data);
      request.flash('success', i18next.t('views.pages.tasks.edit.success'));
      reply.redirect('/tasks');
    } catch (e) {
      request.log.error(e);
      request.flash('error', i18next.t('views.pages.tasks.edit.error'));
      reply.redirect(`/tasks/edit/${request.params.id}`);
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
