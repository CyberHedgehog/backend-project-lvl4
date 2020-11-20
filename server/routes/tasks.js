import _ from 'lodash';
import i18next from 'i18next';
import makeModifiers from '../lib/makeModifiers';

export default (app) => {
  app.get('/tasks', { name: 'tasks', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const filter = _.get(request, 'query', null);
    const tasks = await app.objection.models.task
      .query()
      .withGraphJoined('[creator, executor, status, labels]')
      .modify(makeModifiers(filter, app));
    const statuses = await app.objection.models.status.query();
    const labels = await app.objection.models.label.query();
    const users = await app.objection.models.user.query();
    reply.render('tasks/list', {
      tasks,
      statuses,
      labels,
      users,
    });
  });

  app.get('/tasks/new', { name: 'newTask', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    const labels = await app.objection.models.label.query();
    reply.render('tasks/new', { users, statuses, labels });
  });

  app.get('/tasks/:id/edit', { name: 'editTask', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const task = await app.objection.models.task
      .query()
      .findById(request.params.id);
    if (!task) {
      reply.code(404).render('notFound');
    }
    const labels = await app.objection.models.label.query();
    const taskLabels = await task.$relatedQuery('labels');
    const users = await app.objection.models.user.query();
    const statuses = await app.objection.models.status.query();
    reply.render('tasks/edit', {
      task,
      users,
      statuses,
      labels,
      taskLabels,
    });
  });

  app.post('/tasks', { name: 'addTask', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const taskBody = request.body.task;
    const labelsId = _.has(taskBody, 'labels') ? [...taskBody.labels] : [];
    const data = {
      name: taskBody.name,
      description: taskBody.description,
      creatorId: request.currentUser.id,
      statusId: parseInt(taskBody.statusId, 10),
      executorId: parseInt(taskBody.executorId, 10),
    };
    const { task, label } = app.objection.models;
    const insert = async (taskModel, labelModel, db) => {
      const labels = await labelModel.query(db).findByIds(labelsId);
      await taskModel
        .query(db)
        .insertGraph({ ...data, labels }, { relate: true });
    };
    const trx = await task.startTransaction();
    try {
      await insert(task, label, trx);
      await trx.commit();
      request.flash('success', i18next.t('views.pages.tasks.add.success'));
      reply.redirect(app.reverse('tasks'));
    } catch (e) {
      await trx.rollback();
      console.log(e);
      request.log.error(e);
      request.flash('error', i18next.t('views.pages.tasks.add.error'));
      reply.redirect(app.reverse('newTask'));
    }
  });

  app.patch('/tasks/:id', { name: 'updateTask', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const taskBody = request.body.task;
    const labelsId = _.has(taskBody, 'labels') ? [...taskBody.labels] : [];
    console.log(taskBody);
    const data = {
      ...taskBody,
      id: _.parseInt(request.params.id),
      executorId: _.parseInt(taskBody.executorId),
      statusId: _.parseInt(taskBody.statusId),
      creatorId: _.parseInt(taskBody.creatorId),
    };
    const { task, label } = app.objection.models;
    const update = async (taskModel, labelModel, db) => {
      const labels = await labelModel.query(db).findByIds(labelsId);
      await taskModel.query(db).upsertGraph({
        ...data,
        labels,
      }, { relate: true, unrelate: true, noUpdate: ['labels'] });
    };
    const trx = await task.startTransaction();
    try {
      await update(task, label, trx);
      await trx.commit();
      request.flash('success', i18next.t('views.pages.tasks.edit.success'));
      reply.redirect(app.reverse('tasks'));
    } catch (e) {
      trx.rollback();
      request.log.error(e);
      request.flash('error', i18next.t('views.pages.tasks.edit.error'));
      reply.redirect(app.reverse('editTask', { id: request.params.id }));
    }
  });

  app.delete('/tasks/:id', { name: 'deleteTask', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const targetTask = await app.objection.models.task.query().findById(request.params.id);
    if (request.currentUser.id !== targetTask.creatorId) {
      request.flash('error', i18next.t('views.pages.tasks.delete.notOwnerError'));
      reply.redirect(app.reverse('tasks'));
      return;
    }
    try {
      await app.objection.models.task
        .query()
        .deleteById(request.params.id);
      request.flash('success', i18next.t('views.pages.tasks.delete.success'));
      reply.redirect(app.reverse('tasks'));
    } catch {
      request.flash('error', i18next.t('views.pages.tasks.delete.error'));
      reply.redirect(app.reverse('tasks'));
    }
  });
};
