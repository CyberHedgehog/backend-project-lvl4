import _ from 'lodash';
import { User } from '../models';

export default (router, log) => {
  router
    .get('newUser', '/users/new', async (ctx) => {
      await ctx.render('users/signup');
    })
    .post('/users', async (ctx) => {
      const { body } = ctx.request;
      const user = User.build(body);
      try {
        await user.save();
        // ctx.flash('success', 'Success');
        ctx.redirect(router.url('login'));
      } catch (err) {
        console.log(err);
        // ctx.flash('error', 'Something wrong..');
        await ctx.render('users/signup');
      }
    })
    .get('usersList', '/users/list', async (ctx) => {
      if (ctx.session.userId) {
        const usersList = await User.findAll()
          .map((u) => {
            const { firstName, lastName, email, id } = u;
            return { firstName, lastName, email, id };
          });
        console.log(usersList);
        await ctx.render('users/list', { usersList });
        return;
      }
      // ctx.flash('error', 'Not allowed');
      ctx.redirect(router.url('root'));
    })
    .get('users', '/users/edit', async (ctx) => {
      if (!ctx.session.userId) {
        // ctx.flash('error', 'Not alowed!');
        ctx.redirect(router.url('root'));
        return;
      }
      log('Edit route');
      const user = await User.findOne({ where: { id: ctx.session.userId } });
      await ctx.render('users/edit', { user });
    })
    .patch('users', '/users', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.flash('error', 'Not alowed!');
        ctx.redirect(router.url('root'));
        return;
      }
      const user = await User.findOne({ where: { id: ctx.session.userId } });
      const data = _.omit(ctx.request.body, ['_method']);
      console.log(data);
      try {
        await user.update(data);
        ctx.session.userName = `${user.firstName} ${user.lastName}`;
        ctx.redirect('/users/list');
      } catch (err) {
        ctx.flash('error', 'Invalid data specified');
        await ctx.render('users/edit', { user });
      }
    })
    .delete('users', '/users/:id', async (ctx) => {
      if (!ctx.session.userId) {
        ctx.redirect(router.url('root'));
        return;
      }
      try {
        await User.destroy({ where: { id: ctx.params.id } });
        if (ctx.session.userId.toString() === ctx.params.id) {
          ctx.session = {};
        }
        ctx.redirect(router.url('usersList'));
      } catch (err) {
        await ctx.render('users');
      }
    });
};
