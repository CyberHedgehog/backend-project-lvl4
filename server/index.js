import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyErrorPage from 'fastify-error-page';
import fastifyFormbody from 'fastify-formbody';
import fastifySecureSession from 'fastify-secure-session';
import fastifyFlash from 'fastify-flash';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import Pug from 'pug';
import pointOfView from 'point-of-view';

const app = fastify({ logger: true });

app.get('/', (request, reply) => {
  reply.send({ hello: 'world' });
});

app.listen(3000, '0.0.0.0');
