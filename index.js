import path from 'path';
import _ from 'lodash';
import Koa from 'koa';
import Rollbar from 'rollbar';
import router from 'koa-router';
import Pug from 'koa-pug';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import webpackConfig from './webpack.config';

const app = new Koa();
const compiler = webpack(webpackConfig);
koaWebpack({ compiler })
  .then((middleware) => app.use(middleware));

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
  await ctx.render('index');
});

app.use(appRouter.routes());

const rollbar = new Rollbar({
  accessToken: '58e0ac379e6a4c0d9fde7f3fcc5fa802',
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

app.listen(3000);
