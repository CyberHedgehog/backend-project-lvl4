import encrypt from '../lib/secure';

export default (app) => {
  app.get('/login', async (reuest, reply) => {
    reply.render('login');
  });

  app.post('/login', async (request, reply) => {
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
        reply.redirect('/login');
      }
      if (password === user.passwordDigest) {
        request.session.set('userId', user.id);
        request.flash('success', `Welcome, ${user.firstName}`);
        reply.redirect('/');
      }
    } catch {
      request.flash('error', 'Login error!');
      reply.redirect('/login');
    }
  });

  app.delete('/session', async (request, reply) => {
    request.session.delete();
    reply.redirect('/');
  });
};
