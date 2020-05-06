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
        ctx.session.userName = `${user.firstName} ${user.lastName}`;
        ctx.flash('info', `Welcome, ${user.firstName}!`);
        ctx.redirect(router.url('root'));
        return;
      }
      ctx.flash('error', 'Wrong email or username!');
      await ctx.render('login');
    })
    .delete('session', '/session', async (ctx) => {
      ctx.session = {};
      ctx.redirect(router.url('root'));
    });
};
