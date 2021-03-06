import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import _ from 'lodash';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import qs from 'qs';
import dotenv from 'dotenv';
import i18next from 'i18next';
import path from 'path';
import pointOfView from 'point-of-view';
import Pug from 'pug';
import Rollbar from 'rollbar';
import fastifyAuth from 'fastify-auth';
import createError from 'http-errors';
import en from './locales/en';
import addRoutes from './routes';
import knexConfig from '../knexfile';
import models from './models';

dotenv.config();

const mode = process.env.NODE_ENV || 'development';
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const setupFrontEnd = (app) => {
  i18next.init({
    lng: 'en',
    debug: mode === 'development',
    resources: {
      en,
    },
  });

  app.register(pointOfView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    root: path.join(__dirname, 'views'),
    defaultContext: {
      t(key) {
        return i18next.t(key);
      },
      _,
      isSigned: app.isSigned,
      currentUser: app.currentUser,
      urlFor(...args) {
        return app.reverse(...args);
      },
    },
    options: {
      basedir: path.join(__dirname, 'views'),
    },
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });

  app.register(fastifyStatic, {
    root: process.env !== 'production'
      ? path.join(__dirname, '..', 'dist', 'public')
      : path.join(__dirname, 'public'),
  });
};

const registerPlugins = (app) => {
  app.register(fastifyReverseRoutes.plugin);
  app.register(fastifyFormbody, { parser: qs.parse });
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
  if (process.env.NODE_ENV !== 'production') app.register(fastifyErrorPage);
};

const addHooks = (app) => {
  app.decorateRequest('currentUser', null);
  app.decorateRequest('isSigned', false);
  app.decorateRequest('createError', createError);
  app.addHook('preHandler', async (request) => {
    const userId = request.session.get('userId');
    if (userId) {
      request.currentUser = await app.objection.models.user.query().findById(userId);
      request.isSigned = true;
    }
  });
};

export default () => {
  const app = fastify({
    logger: {
      prettyPrint: mode === 'development',
    },
  });
  setupFrontEnd(app);
  registerPlugins(app);
  addHooks(app);
  app.decorate('authCheck', async (request, reply) => {
    if (!request.isSigned) {
      request.flash('error', i18next.t('views.messages.notLogged'));
      reply.redirect(app.reverse('root'));
    }
  })
    .register(fastifyAuth)
    .after(() => {
      addRoutes(app);
    });
  if (mode === 'production') {
    app.setErrorHandler((error, req, reply) => {
      rollbar.error(error);
      reply.send(error);
    });
  }
  return app;
};
