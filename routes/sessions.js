import { User } from '../models';
import encrypt from '../lib/secure';

export default (router) => {
  router
    .get('login', '/login', async (ctx) => {
      await ctx.render('login');
    })
    .post('login', '/login', async (ctx) => {
      const { body } = ctx.request;
      const user = await User.findOne({ where: { email: body.email } });
      if (user && encrypt(body.password) === user.passwordDigest) {
        ctx.session.userId = user.id;
        ctx.flash.set(`Welcome, ${user.firstName}!`);
        ctx.redirect(router.url('root'));
        return;
      }
      ctx.flash.set('Wrong email or username!');
      await ctx.render('login');
    })
    .delete('test', '/test', async (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
