import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import path from 'path';
import Pug from 'pug';
import pointOfView from 'point-of-view';
import dotenv from 'dotenv';
import addRoutes from './routes';
import knexConfig from './knexfile';
import models from './models';

dotenv.config();

const mode = process.env.NODE_ENV || 'development';

export default () => {
  const app = fastify({
    logger: {
      prettyPrint: mode === 'development',
    },
  });

  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    root: path.join(__dirname, 'views'),
    options: {
      basedir: path.join(__dirname, 'views'),
    },
  });

  app.register(fastifyStatic, {
    root: process.env !== 'production'
      ? path.join(__dirname, '..', 'dist', 'public')
      : path.join(__dirname, 'public'),
  });

  app.addHook('preHandler', async (request) => {
    const userId = request.session.get('userId');
    if (userId) {
      request.currentUser = await app.objecton.models.user.query().findById(userId);
      request.isSigned = true;
    }
  });

  addRoutes(app);

  app.register(fastifyErrorPage);
  app.register(fastifyFormbody);
  app.register(fastifySecureSession, {
    secret: process.env.APPKEY,
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
  return app;
};
