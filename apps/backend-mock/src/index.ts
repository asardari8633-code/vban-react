import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';

import { app } from './app';

const PORT = Number(process.env.PORT ?? 5320);

app.use('*', logger());

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Mock service is running at http://localhost:${info.port}/api`);
});
