import i18next from 'i18next';

export default (app) => {
  app.get('/statuses', { name: 'statuses', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    const statuses = await app.objection.models.status.query();
    reply.render('statuses/list', { statuses });
  });

  app.get('/statuses/new', { name: 'newStatus', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    reply.render('statuses/new');
  });

  app.get('/statuses/:id/edit', { name: 'editStatus', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    try {
      const status = await app.objection.models.status
        .query()
        .findById(request.params.id);
      if (!status) {
        reply.code(404).render('notFound');
      }
      reply.render('statuses/edit', { status });
    } catch (e) {
      request.flash('error', i18next.t('views.pages.statuses.edit.error'));
      reply.redirect(app.reverse('statuses'));
    }
  });

  app.post('/statuses', { name: 'addStatus', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    try {
      await app.objection.models.status.query().insert(request.body.status);
      request.flash('success', i18next.t('views.pages.statuses.add.success'));
      reply.redirect(app.reverse('statuses'));
    } catch {
      request.flash('error', i18next.t('views.pages.statuses.add.error'));
      reply.render('statuses/new', { status: request.body });
    }
  });

  app.delete('/statuses/:id', { name: 'deleteStatus', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    try {
      const relatedStatuses = await app.objection.models.task
        .query()
        .select()
        .where('status_id', '=', request.params.id);
      if (relatedStatuses.length > 0) {
        request.flash('error', i18next.t('views.pages.statuses.delete.errUsed'));
      } else {
        await app.objection.models.status.query().deleteById(request.params.id);
        request.flash('success', i18next.t('views.pages.statuses.delete.success'));
      }
      reply.redirect(app.reverse('statuses'));
    } catch (e) {
      request.log.error(e);
      request.flash('error', i18next.t('views.pages.statuses.delete.error'));
      reply.redirect(app.reverse('statuses'));
    }
  });

  app.patch('/statuses/:id', { name: 'updateStatus', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
    try {
      const status = await app.objection.models.status
        .query()
        .findById(request.params.id);
      await status.$query().update(request.body.status);
      request.flash('success', i18next.t('views.pages.statuses.edit.success'));
      reply.redirect(app.reverse('statuses'));
    } catch {
      request.flash('error', i18next.t('views.pages.statuses.edit.error'));
      reply.redirect(app.reverse('editStatus', { id: request.params.id }));
    }
  });
};
