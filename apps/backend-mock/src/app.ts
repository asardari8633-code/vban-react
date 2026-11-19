import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { auth } from './routes/auth';
import { misc } from './routes/misc';
import { system } from './routes/system';
import { useResponseError } from './utils/response';

export const app = new Hono().basePath('/api');

app.use(
  '*',
  cors({
    allowHeaders: ['Accept-Language', 'Authorization', 'Content-Length', 'Content-Type', 'X-CSRF-TOKEN', 'X-Requested-With'],
    allowMethods: ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    credentials: true,
    origin: (origin) => origin ?? '*',
  }),
);

app.route('/', auth);
app.route('/', system);
app.route('/', misc);

app.get('/', (c) =>
  c.html(`<h1>Vben Admin React — Mock Service</h1><p>سرور ماک در حال اجراست.</p>`),
);

app.notFound((c) => c.json(useResponseError('Not Found'), 404));
app.onError((err, c) => {
  console.error(err);
  return c.json(useResponseError(err.message), 500);
});
