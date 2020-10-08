import encrypt from '../lib/secure';

export default (app) => {
  app.get('/login', { name: 'login' }, async (req, reply) => {
    reply.view('login');
  });

  app.post('/login', async (req, reply) => {
    const [user] = await app.objection.models.user
      .query()
      .select()
      .where({
        email: req.body.email,
      });
    const password = encrypt(req.body.password);
    if (password === user.passwordDigest) {
      req.session.set('cookie', user.id);
      reply.redirect('/');
    }
    reply.view('/login');
  });
};
