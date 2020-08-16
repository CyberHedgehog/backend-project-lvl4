// import _ from 'lodash';
import { Task } from '../models';

export default (router) => {
  router
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
    });
};
