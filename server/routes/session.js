import encrypt from '../lib/secure';

export default (app) => {
  app.get('/login', async (reuest, reply) => {
    reply.render('login');
  });

  app.post('/login', async (request, reply) => {
    const [user] = await app.objection.models.user
      .query()
      .select()
      .where({
        email: request.body.email,
      });
    const password = encrypt(request.body.password);
    if (!user || password !== user.passwordDigest) {
      request.flash('warning', 'Bad username or password');
      reply.render('/login');
    }
    if (password === user.passwordDigest) {
      request.session.set('userId', user.id);
      request.flash('success', `Welcome, ${user.firstName}`);
      reply.redirect('/');
    }
  });

  app.delete('/session', async (request, reply) => {
    request.session.delete();
    reply.redirect('/');
  });
};
