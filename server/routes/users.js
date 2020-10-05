export default (app) => {
  app.get('/users/new', { name: 'new' }, (req, reply) => {
    reply.view('users/signup');
  });
  app.post('/users', async (req, reply) => {
    const user = await app.objection.models.user.fromJson(req.body.object);
    try {
      await app.objection.models.user.query().insert(user);
      reply.redirect('/root');
    } catch (e) {
      console.log(e);
      reply.view('/users/new', { message: e });
    }
  });
};
