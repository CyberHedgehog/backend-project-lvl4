import path from 'path';
import _ from 'lodash';
import Koa from 'koa';
import Rollbar from 'rollbar';
import router from 'koa-router';
import Pug from 'koa-pug';
import koaWebpack from 'koa-webpack';
import webpackConfig from './webpack.config';

const app = new Koa();

if (process.env.NODE_ENV !== 'test') {
  koaWebpack({ config: webpackConfig }).then((m) => app.use(m));
}

const pug = new Pug({
  viewPath: path.resolve(__dirname, 'views'),
  basedir: path.join(__dirname, 'views'),
  helperPath: [
    { _ },
    { urlFor: (...args) => router.url(...args) },
  ],
});

pug.use(app);

const appRouter = router();
appRouter.get('/', async (ctx) => {
  await ctx.render('startPage');
});

app.use(appRouter.routes());

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    rollbar.error(err, ctx.request);
  }
});

export default app;
