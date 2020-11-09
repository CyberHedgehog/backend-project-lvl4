export default (app) => {
  app.get('/', { name: 'root' }, (req, reply) => {
    reply.render('startPage');
  });
};
