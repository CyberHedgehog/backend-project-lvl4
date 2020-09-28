import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';
import webpackConfig from '../webpack.config';
import knexConfig from './knexfile';
import models from './models';

const mode = process.env.NODE_ENV || 'development';
const app = fastify({
  logger: true,
});

const { devServer } = webpackConfig;
const devHost = `http://${devServer.host}:${devServer.port}`;
const domain = mode === 'development' ? devHost : '';
app.register(pointOfView, {
  engine: {
    pug: Pug,
  },
  includeViewExtension: true,
  defaultContext: {
    assetPath: (filename) => `${domain}/assets/${filename}`,
  },
  templates: path.join(__dirname, '..', 'server', 'views'),
});

app.decorateReply('render', function render(viewPath, locals) {
  this.view(viewPath, { ...locals, reply: this });
});

const pathPublic = mode === 'production'
  ? path.join(__dirname, '..', 'public')
  : path.join(__dirname, '..', 'dist', 'public');
app.register(fastifyStatic, {
  root: pathPublic,
  prefix: '/assets/',
});

app.register(fastifyErrorPage);
app.register(fastifyReverseRoutes);
app.register(fastifyFormbody);
app.register(fastifySecureSession, {
  secret: process.APPKEY,
  cookie: {
    path: '/',
  },
});
app.register(fastifyFlash);
app.register(fastifyMethodOverride);
app.register(fastifyObjectionjs, {
  knexConfig: knexConfig[mode],
  models,
});

export default app;
