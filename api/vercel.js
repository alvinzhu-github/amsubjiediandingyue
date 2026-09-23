import { mainHandler } from '../core/handler.js';

export default async function handler(req, res) {
    try {
        const rawHost = req.headers?.host || 'localhost';
        const url = new URL(req.url, `https://${rawHost}`);
        const headers = new Headers(req.headers);
        const result = await mainHandler({ req, url, headers, res, env: process.env });

        if (res.writableEnded) {
            return;
        }

        const text = result && typeof result.text === 'function' ? await result.text() : result || '';
        const status = result?.status || 200;
        if (result?.headers && typeof result.headers.forEach === 'function') {
            result.headers.forEach((value, key) => res.setHeader(key, value));
        }
        res.status(status).send(text);
    } catch (err) {
        console.error('Vercel Error:', err);
        res.status(500).send('Vercel Error: ' + err.message);
    }
};
