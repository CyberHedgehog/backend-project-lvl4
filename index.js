import path from 'path';
import _ from 'lodash';
import Koa from 'koa';
import bodyParser from 'koa-body-parser';
import serve from 'koa-static';
import Router from 'koa-router';
import session from 'koa-generic-session';
import flash from 'koa-flash-simple';
import methodOverride from 'koa-methodoverride';
import Rollbar from 'rollbar';
import Pug from 'koa-pug';
import koaWebpack from 'koa-webpack';
import webpackConfig from './webpack.config';
import container from './container';
import addRoutes from './routes';

require('dotenv').config();

export default () => {
  const app = new Koa();
  app.keys = [process.env.APPKEY];
  app.use(session(app));
  app.use(bodyParser());
  app.use(methodOverride());
  app.use(flash());
  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
      isSignedIn: () => ctx.session.userId !== undefined,
    };
    await next();
  });

  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
    koaWebpack({ config: webpackConfig }).then((m) => app.use(m));
  }

  app.use(serve(path.join(__dirname, 'public')));

  const appRouter = new Router();

  addRoutes(appRouter, container);
  app.use(appRouter.allowedMethods());
  app.use(appRouter.routes());

  const rollbar = new Rollbar({
    accessToken: process.env.ROLLBAR,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  const pug = new Pug({
    viewPath: path.resolve(__dirname, 'views'),
    basedir: path.join(__dirname, 'views'),
    helperPath: [
      { _ },
      { urlFor: (...args) => appRouter.url(...args) },
    ],
  });

  pug.use(app);

  app.use((ctx, next) => {
    try {
      next();
    } catch (err) {
      rollbar.error(err, ctx.request);
    }
  });

  return app;
};
