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
    .delete('users', '/users/:id', async (ctx) => {
      console.log(`Session.id = ${ctx.session.userId}`);
      User.destroy({ where: { id: ctx.params.id } });
      ctx.redirect(router.url('root'));
    });
};
