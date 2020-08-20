import _ from 'lodash';
import { Task } from '../models';

export default (router, log) => {
  router
    .get('tasksList', '/tasks', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.redirect(router.url('root'));
      }
      const tasksList = await Task.findAll();
      await ctx.render('tasks/list', { tasksList });
    })
    .get('newTask', '/tasks/new', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.redirect(router.url('root'));
      }
      await ctx.render('tasks/create');
    })
    .post('/tasks/new', async (ctx) => {
      const { body } = ctx.request;
      const task = Task.build(body);
      try {
        await task.save();
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        log(err);
        ctx.flash('error', 'Something wrong...');
        await ctx.render(router.url('tasks'));
      }
    })
    .delete('/tasks/:id', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.redirect(router.url('root'));
        return;
      }
      try {
        await Task.destroy({ where: { id: ctx.params.id } });
        ctx.redirect(router.url('tasks'));
      } catch (err) {
        ctx.flash('error', 'Something wrong...');
        await ctx.render('tasks');
      }
    })
    .patch('/tasks/:id', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.redirect(router.url('root'));
        return;
      }
      const data = _.omit(ctx.request.body, ['_method']);
      try {
        const task = await Task.findOne({ where: { id: ctx.params.id } });
        await task.update(data);
        ctx.redirect(router.url('tasksList'));
      } catch (err) {
        await ctx.render('tasks/list');
      }
    });
};
