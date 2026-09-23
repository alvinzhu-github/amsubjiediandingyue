import { readFile, writeFile } from 'node:fs/promises';

const workerEntry = `export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const headers = request.headers;
            return await mainHandler({ req: request, url, headers, res: null, env, platform: { connect } });
        } catch (err) {
            errorLogs('Worker Error:', err);
            return new Response('Worker Error: ' + err.message, { status: 500 });
        }
    },
};`;

const kvSource = (await readFile(new URL('../core/kv.js', import.meta.url), 'utf8'))
    .replaceAll('export ', '')
    .trim();

const runtimeSource = (await readFile(new URL('../core/runtime.js', import.meta.url), 'utf8'))
    .replaceAll('export ', '')
    .trim();

const cloudflareModules = [
    '../core/cloudflare/protocol.js',
    '../core/cloudflare/tcp.js',
    '../core/cloudflare/udp.js',
    '../core/cloudflare/websocket.js',
    '../core/cloudflare/http-transport.js',
    '../core/cloudflare/grpc.js',
    '../core/cloudflare/proxy.js'
];
const cloudflareSource = (await Promise.all(cloudflareModules.map(async path => {
    return (await readFile(new URL(path, import.meta.url), 'utf8'))
        .replace(/^import .*?;\n/gm, '')
        .replace(/^export (async )?function /gm, '$1function ')
        .trim();
}))).join('\n\n');

const handlerSource = (await readFile(new URL('../core/handler.js', import.meta.url), 'utf8'))
    .replace(/^import .*?;\n/gm, '')
    .replace(/\/\/ export default \{[\s\S]*?\/\/ \};/, workerEntry)
    .replace('export async function mainHandler', 'async function mainHandler')
    .replace(/^export function /gm, 'function ')
    .trim();

await writeFile(new URL('../_worker.src.js', import.meta.url), `import { connect } from 'cloudflare:sockets';\n\n${runtimeSource}\n\n${kvSource}\n\n${cloudflareSource}\n\n${handlerSource}\n`);
