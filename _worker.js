import { mainHandler } from './core/handler.js';
import { connect } from 'cloudflare:sockets';

export default {
  async fetch(request, env) {
      try {
        const url = new URL(request.url);
        const headers = request.headers;
        return await mainHandler({ req: request, url, headers, res: null, env, platform: { connect } });
      } catch (err) {
        console.error('Worker Error:', err);
        return new Response('Worker Error: ' + err.message, { status: 500 });
      }
  },
};
