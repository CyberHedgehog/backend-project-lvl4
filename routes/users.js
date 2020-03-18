import { User } from '../models';

export default (router) => {
  router
    .get('newUser', '/users/new', async (ctx) => {
      await ctx.render('signup');
    })
    .post('users', '/users', async (ctx) => {
      const { body } = ctx.request;
      const user = User.build(body);
      try {
        await user.save();
        ctx.flash.set('Success');
        ctx.redirect(router.url('root'));
      } catch (err) {
        ctx.flash.set('Something wrong..');
        await ctx.render('signup');
      }
    })
    .get('users', '/users/list', async (ctx) => {
      if (ctx.session.userId) {
        await ctx.render('list');
        return;
      }
      ctx.flash.set('Not allowed');
      ctx.redirect(router.url('root'));
    })
    .get('users', '/users/edit', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.flash.set('Not alowed!');
        ctx.redirect(router.url('root'));
        return;
      }
      ctx.render('edit');
    })
    .patch('users', '/users/edit', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.flash.set('Not alowed!');
        ctx.redirect(router.url('root'));
        return;
      }
      const user = await User.findOne({ where: { id: ctx.session.userId } });
      const { body } = ctx.request;
      await user.update(body);
      ctx.redirect(router.url('/users/edit'));
    })
    .delete('users', '/users/:id', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.flash.set('Not allowed!');
        ctx.redirect(router.url('root'));
        return;
      }
      try {
        User.destroy({ where: { id: ctx.params.id } });
        ctx.redirect(router.url('root'));
      } catch (err) {
        ctx.flash.set('Something wrong..');
        await ctx.render('users');
      }
    });
};
