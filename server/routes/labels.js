import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app.get('/labels', { name: 'labels', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    const labels = await app.objection.models.label.query();
    reply.render('labels/list', { labels });
  });

  app.get('/labels/new', { name: 'newLabel', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    reply.render('labels/new');
  });

  app.get('/labels/:id/edit', { name: 'editLabel', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    try {
      const label = await app.objection.models.label.query().findById(req.params.id);
      if (!label) {
        reply.callNotFound();
      }
      reply.render('labels/edit', { label });
    } catch {
      req.flash('error', i18next.t('views.pages.labels.edit.error'));
      reply.redirect(app.reverse('labels'));
    }
  });

  app.post('/labels', { name: 'addLabel', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    try {
      await app.objection.models.label.query().insert(req.body);
      req.flash('success', i18next.t('views.pages.labels.add.success'));
      reply.redirect(app.reverse('labels'));
    } catch {
      req.flash('error', i18next.t('views.pages.labels.add.error'));
      reply.redirect(app.reverse('labels'));
    }
  });

  app.patch('/labels/:id', { name: 'updateLabel', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    const data = _.omitBy(req.body, (e) => e === 'PATCH');
    try {
      const label = await app.objection.models.label
        .query()
        .findById(req.params.id);

      await label.$query().patch(data);
      req.flash('success', i18next.t('views.pages.labels.edit.success'));
      reply.redirect(app.reverse('labels'));
    } catch (e) {
      req.flash('error', i18next.t('views.pages.labels.edit.error'));
      reply.redirect(app.reverse('editLabel', { id: req.params.id }));
    }
  });

  app.delete('/labels/:id', { name: 'deleteLabel', preHandler: app.auth([app.authCheck]) }, async (req, reply) => {
    try {
      await app.objection.models.label.query().deleteById(req.params.id);
      req.flash('success', i18next.t('views.pages.labels.delete.success'));
      reply.redirect(app.reverse('labels'));
    } catch {
      req.flash('error', i18next.t('views.pages.labels.delete.error'));
      reply.redirect(app.reverse('labels'));
    }
  });
};
