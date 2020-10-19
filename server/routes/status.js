import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app.get('/statuses', async (request, reply) => {
    if (!request.isSigned) {
      reply.redirect('/');
      return;
    }
    const statuses = await app.objection.models.status.query();
    reply.render('statuses/list', { statuses });
  });

  app.get('/statuses/new', async (request, reply) => {
    reply.render('statuses/new');
  });

  app.get('/statuses/edit/:id', async (request, reply) => {
    try {
      const status = await app.objection.models.status
        .query()
        .findById(request.params.id);
      reply.render('statuses/edit', { status });
    } catch {
      request.flash('warning', i18next.t('views.pages.statuses.edit.error'));
      reply.redirect('/statuses');
    }
  });

  app.post('/statuses', async (request, reply) => {
    try {
      await app.objection.models.status.query().insert(request.body);
      request.flash('success', i18next.t('views.pages.statuses.add.success'));
      reply.redirect('/statuses');
    } catch {
      request.flash('error', i18next.t('views.pages.statuses.add.error'));
      reply.redirect('/statuses');
    }
  });

  app.delete('/statuses/:id', async (request, reply) => {
    try {
      await app.objection.models.status.query().deleteById(request.params.id);
      request.flash('success', i18next.t('views.pages.statuses.delete.success'));
      reply.redirect('/statuses');
    } catch {
      request.flash('error', i18next.t('views.pages.statuses.delete.error'));
    }
  });

  app.patch('/statuses/:id', async (request, reply) => {
    const data = _.omitBy(request.body, (e) => e === 'PATCH');
    try {
      const status = await app.objection.models.status
        .query()
        .findById(request.params.id);
      await status.$query().update(data);
      request.flash('success', i18next.t('views.pages.statuses.edit.success'));
      reply.redirect('/statuses');
    } catch {
      request.flash('error', i18next.t('views.pages.statuses.edit.error'));
      reply.redirect(`/statuses/edit/${request.params.id}`);
    }
  });
};
