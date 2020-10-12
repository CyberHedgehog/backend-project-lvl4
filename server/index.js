import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import dotenv from 'dotenv';
import i18next from 'i18next';
import i18mw from 'i18next-http-middleware';
import path from 'path';
import pointOfView from 'point-of-view';
import Pug from 'pug';
import en from './locales/en';
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

  addRoutes(app);

  i18next.use(i18mw.LanguageDetector).init({
    lng: 'en',
    debug: mode === 'development',
    resources: {
      en,
    },
    register: global,
  });

  app.register(i18mw.plugin, {
    i18next,
  });

  app.decorateRequest('currentUser', null);
  app.decorateRequest('isSigned', false);

  app.addHook('preHandler', async (request) => {
    const userId = request.session.get('userId');
    if (userId) {
      request.currentUser = await app.objection.models.user.query().findById(userId);
      request.isSigned = true;
    }
  });

  app.register(fastifyErrorPage);
  app.register(fastifyFormbody);
  app.register(fastifySecureSession, {
    cookieName: 'session',
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
