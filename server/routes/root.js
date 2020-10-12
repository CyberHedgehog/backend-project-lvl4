export default (app) => {
  app.get('/', { name: 'root' }, (req, reply) => {
    reply.view('startPage', { t: req.t });
  });
};
