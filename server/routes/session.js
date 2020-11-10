import encrypt from '../lib/secure';

export default (app) => {
  app.get('/login', { name: 'login' }, async (reuest, reply) => {
    reply.render('login');
  });

  app.post('/login', { name: 'newSession' }, async (request, reply) => {
    try {
      const [user] = await app.objection.models.user
        .query()
        .select()
        .where({
          email: request.body.email,
        });
      const password = encrypt(request.body.password);
      if (!user || password !== user.passwordDigest) {
        request.flash('error', 'Bad username or password');
        reply.redirect(app.reverse('login'));
      }
      if (password === user.passwordDigest) {
        request.session.set('userId', user.id);
        request.flash('success', `Welcome, ${user.firstName}`);
        reply.redirect(app.reverse('root'));
      }
    } catch {
      request.flash('error', 'Login error!');
      reply.redirect(app.reverse('login'));
    }
  });

  app.delete('/session', { name: 'deleteSession' }, async (request, reply) => {
    request.session.delete();
    reply.redirect(app.reverse('root'));
  });
};
