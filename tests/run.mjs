import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { ReadableStream, WritableStream } from 'node:stream/web';
import { appendToKV, getKvBinding, loadFromKV, saveToKV } from '../core/kv.js';
import { getRuntime } from '../core/runtime.js';
import { detectCloudflareTransport } from '../core/cloudflare/proxy.js';
import { assertSafeDestination, parseVlessPacket } from '../core/cloudflare/protocol.js';
import { handleHttpTransport } from '../core/cloudflare/http-transport.js';

globalThis.crypto = webcrypto;
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;

class TestHeaders {
    constructor(values = {}) {
        this.values = new Map();
        const entries = values instanceof TestHeaders ? values.values : Object.entries(values);
        for (const [key, value] of entries) this.set(key, value);
    }
    get(key) { return this.values.get(String(key).toLowerCase()) ?? null; }
    set(key, value) { this.values.set(String(key).toLowerCase(), String(value)); }
    forEach(callback) { this.values.forEach((value, key) => callback(value, key, this)); }
}

class TestRequest {
    constructor(url, options = {}) {
        this.url = url;
        this.method = options.method || 'GET';
        this.headers = new TestHeaders(options.headers);
        this.body = options.body || '';
    }
    async text() { return this.body; }
    async json() { return JSON.parse(this.body); }
    async arrayBuffer() {
        if (this.body instanceof Uint8Array) return this.body.buffer.slice(this.body.byteOffset, this.body.byteOffset + this.body.byteLength);
        return new TextEncoder().encode(String(this.body)).buffer;
    }
}

class TestResponse {
    constructor(body = '', options = {}) {
        this.body = body;
        this.status = options.status || 200;
        this.headers = new TestHeaders(options.headers);
    }
    async text() { return String(this.body); }
    static redirect(url, status = 302) {
        const response = new TestResponse('', { status, headers: { location: url } });
        response.headers.set = () => { throw new TypeError("Can't modify immutable headers."); };
        return response;
    }
}

globalThis.Headers = TestHeaders;
globalThis.Request = TestRequest;
globalThis.Response = TestResponse;

const { detectCarrier, detectSubscriptionTarget, getSsLinkConfig, mainHandler, normalizeHostList, patchSubscriptionContent } = await import('../core/handler.js');

async function invoke(path, env, options = {}) {
    const request = new TestRequest(`https://example.com${path}`, options);
    return await mainHandler({
        req: request,
        url: new URL(request.url),
        headers: request.headers,
        res: null,
        env
    });
}

const baseEnv = {
    ID: 'first-password',
    UUID: '11111111-1111-4111-8111-111111111111',
    HOST: 'node.example.com'
};

function uuidBytes(uuid) {
    const hex = uuid.replaceAll('-', '');
    return Uint8Array.from(hex.match(/../g), value => parseInt(value, 16));
}

function vlessPacket(uuid, host, port, command = 1, payload = new Uint8Array()) {
    const hostBytes = new TextEncoder().encode(host);
    const output = new Uint8Array(1 + 16 + 1 + 1 + 2 + 1 + 1 + hostBytes.length + payload.length);
    let offset = 0;
    output[offset++] = 1;
    output.set(uuidBytes(uuid), offset); offset += 16;
    output[offset++] = 0;
    output[offset++] = command;
    output[offset++] = port >> 8;
    output[offset++] = port & 255;
    output[offset++] = 2;
    output[offset++] = hostBytes.length;
    output.set(hostBytes, offset); offset += hostBytes.length;
    output.set(payload, offset);
    return output;
}

const parsedVless = parseVlessPacket(vlessPacket(baseEnv.UUID, 'example.com', 443, 1, new Uint8Array([1, 2])), baseEnv.UUID);
assert.equal(parsedVless.host, 'example.com');
assert.equal(parsedVless.port, 443);
assert.deepEqual([...parsedVless.payload], [1, 2]);
assert.throws(() => parseVlessPacket(vlessPacket(baseEnv.UUID, '127.0.0.1', 443), baseEnv.UUID), /Private destinations/);
assert.throws(() => parseVlessPacket(vlessPacket(baseEnv.UUID, 'example.com', 53, 2), '22222222-2222-4222-8222-222222222222'), /Unauthorized/);
assert.throws(() => assertSafeDestination('example.com', 25), /port/);

const websocketRequest = new TestRequest('https://example.com/tunnel', { headers: { upgrade: 'websocket' } });
assert.equal(detectCloudflareTransport(websocketRequest, new URL(websocketRequest.url)), 'websocket');
const grpcRequest = new TestRequest('https://example.com/tunnel', { method: 'POST', headers: { 'content-type': 'application/grpc' } });
assert.equal(detectCloudflareTransport(grpcRequest, new URL(grpcRequest.url)), 'grpc');
const normalPost = new TestRequest('https://example.com/login', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' } });
assert.equal(detectCloudflareTransport(normalPost, new URL(normalPost.url)), null);

const tcpWrites = [];
const mockConnect = ({ hostname, port }) => {
    assert.equal(hostname, 'example.com');
    assert.equal(port, 443);
    return {
        readable: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([9])); controller.close(); } }),
        writable: new WritableStream({ write(chunk) { tcpWrites.push(...chunk); } }),
        async close() {}
    };
};
const httpTransportRequest = new TestRequest('https://example.com/tunnel?transport=xhttp', {
    method: 'POST',
    body: vlessPacket(baseEnv.UUID, 'example.com', 443, 1, new Uint8Array([7]))
});
const httpTransportResponse = await handleHttpTransport(httpTransportRequest, baseEnv.UUID, false, mockConnect);
assert.equal(httpTransportResponse.status, 200);
assert.deepEqual(tcpWrites, [7]);
const transportRead = await httpTransportResponse.body.getReader().read();
assert.deepEqual([...transportRead.value], [1, 0, 9]);

const loginPage = await invoke('/login', baseEnv);
assert.equal(loginPage.status, 200);
assert.match(await loginPage.text(), /请输入密码登录/);

const unsupportedWebSocket = await invoke('/tunnel', baseEnv, { headers: { upgrade: 'websocket' } });
assert.equal(unsupportedWebSocket.status, 501);
assert.match(await unsupportedWebSocket.text(), /only available on Cloudflare Workers/);

const accepted = await invoke('/login', baseEnv, {
    method: 'POST',
    body: 'password=first-password'
});
assert.equal(accepted.status, 302);
assert.equal(accepted.headers.get('location'), 'https://example.com/first-password');
assert.match(accepted.headers.get('set-cookie'), /^admin_session=/);

assert.equal(normalizeHostList('https://edge.example.com:8443/path, second.example.com', 'fallback.example.com'), 'edge.example.com,second.example.com');
assert.equal(normalizeHostList('', 'fallback.example.com:443'), 'fallback.example.com');

const fallbackHostPage = await invoke(`/${baseEnv.ID}`, { ...baseEnv, HOST: undefined }, {
    headers: { 'user-agent': 'Mozilla/5.0' }
});
const fallbackHostHtml = await fallbackHostPage.text();
assert.match(fallbackHostHtml, /host=example\.com/);
assert.match(fallbackHostHtml, /sni=example\.com/);
assert.doesNotMatch(fallbackHostHtml, /[0-9a-f-]{36}\.xyz/);

const isolated = await invoke('/login', { ...baseEnv, ID: 'second-password' }, {
    method: 'POST',
    body: 'password=first-password'
});
assert.equal(isolated.status, 403);

assert.equal(detectSubscriptionTarget('Surge/5.0', new URL('https://example.com/sub')), 'surge');
assert.equal(detectSubscriptionTarget('', new URL('https://example.com/sub?quanx')), 'quanx');
assert.equal(detectSubscriptionTarget('', new URL('https://example.com/sub?target=loon')), 'loon');
assert.equal(detectSubscriptionTarget('ClashMeta', new URL('https://example.com/sub')), 'clash');
assert.equal(detectCarrier({ cf: { country: 'CN', asn: 9808 } }), 'cmcc');
assert.equal(detectCarrier({ cf: { country: 'US', asn: 9808 } }), 'cf');
assert.equal(patchSubscriptionContent('singbox', '\uFEFF{"outbounds":[]}'), '{\n  "outbounds": []\n}');
assert.equal(patchSubscriptionContent('surge', '[Proxy]\r\na=b'), '[Proxy]\na=b\n');

const ssLink = getSsLinkConfig({
    method: 'aes-128-gcm',
    password: baseEnv.UUID,
    host: baseEnv.HOST,
    address: '1.1.1.1',
    port: '443',
    remarks: 'US',
    path: '/?ed=2560',
    tls: ['tls', true]
});
assert.match(ssLink, /^ss:\/\//);
assert.match(decodeURIComponent(ssLink), /v2ray-plugin;mode=websocket/);

const settings = await invoke('/second-password/setting', { ...baseEnv, ID: 'second-password' });
assert.equal(settings.status, 200);
assert.match(await settings.text(), /\/second-password\?sub/);

const ipPage = await invoke('/second-password/ips', { ...baseEnv, ID: 'second-password' });
assert.equal(ipPage.status, 200);
assert.match(await ipPage.text(), /\/second-password\/save/);
assert.match(await ipPage.text(), /自动识别运营商/);

const values = new Map();
const binding = {
    async get(key) { return values.get(key) ?? null; },
    async put(key, value) { values.set(key, value); }
};
assert.equal(getKvBinding({ KV: binding }), binding);
assert.equal(getKvBinding({ ips: binding }), binding);
await saveToKV({ KV: binding }, 'items', 'a\nb');
await appendToKV({ KV: binding }, 'items', 'b\nc');
assert.equal(await loadFromKV({ KV: binding }, 'items'), 'a\nb\nc');

const unauthorizedAdmin = await invoke('/admin', { ...baseEnv, KV: binding });
assert.equal(unauthorizedAdmin.status, 302);
assert.equal(unauthorizedAdmin.headers.get('location'), '/login');

const adminCookie = accepted.headers.get('set-cookie').split(';')[0];
const adminPage = await invoke('/admin', { ...baseEnv, KV: binding }, {
    headers: { cookie: adminCookie }
});
assert.equal(adminPage.status, 200);
assert.match(await adminPage.text(), /订阅器后台管理/);

const savedConfig = await invoke('/admin/config.json', { ...baseEnv, KV: binding }, {
    method: 'PUT',
    headers: { cookie: adminCookie, origin: 'https://example.com' },
    body: JSON.stringify({ HOST: 'stored.example.com', PROT_TYPE: 'ss', UNKNOWN: 'ignored' })
});
assert.equal(savedConfig.status, 200);
assert.deepEqual(JSON.parse(await savedConfig.text()).config, { HOST: 'stored.example.com', PROT_TYPE: 'ss' });
assert.equal(JSON.parse(values.get('config/v1')).HOST, 'stored.example.com');

const savedAdminIp = await invoke('/admin/ip/normal', { ...baseEnv, KV: binding }, {
    method: 'PUT',
    headers: { cookie: adminCookie, origin: 'https://example.com' },
    body: JSON.stringify({ items: '1.1.1.1:443#US' })
});
assert.equal(savedAdminIp.status, 200);
assert.equal(values.get('ip/normal'), '1.1.1.1:443#US');
assert.equal(values.get('cf_normal_ip'), '1.1.1.1:443#US');

const saved = await invoke('/first-password/save', { ...baseEnv, KV: binding }, {
    method: 'POST',
    body: JSON.stringify({ key: 'route-items', items: 'x\ny' })
});
assert.equal(saved.status, 200);
assert.equal(await loadFromKV({ KV: binding }, 'route-items'), 'x\ny');

const originalFetch = globalThis.fetch;
globalThis.fetch = async url => {
    const value = String(url);
    if (value.includes('/sub?target=surge')) {
        return { ok: true, status: 200, async text() { return '[Proxy]\r\nnode=test'; } };
    }
    return { ok: true, status: 200, async text() { return '1.1.1.1:443#US'; } };
};
const emptyBinding = { async get() { return null; }, async put() {} };
const ssSubscription = await invoke('/first-password?sub&PROT_TYPE=ss', { ...baseEnv, KV: emptyBinding }, {
    headers: { 'user-agent': 'subscription-client' }
});
assert.match(Buffer.from(await ssSubscription.text(), 'base64').toString('utf8'), /ss:\/\//);

const surgeSubscription = await invoke('/first-password?surge', { ...baseEnv, KV: emptyBinding }, {
    headers: { 'user-agent': 'Surge/5.0' }
});
assert.equal(surgeSubscription.headers.get('content-type'), 'text/plain;charset=utf-8');
assert.equal(await surgeSubscription.text(), '[Proxy]\nnode=test');
globalThis.fetch = originalFetch;

assert.equal(getRuntime({}, { setHeader() {} }), 'vercel');
assert.equal(getRuntime({}), 'unknown');

const vercelHandler = (await import('../api/vercel.js')).default;
function createVercelResponse() {
    return {
        headers: new Map(),
        statusCode: 200,
        body: '',
        writableEnded: false,
        setHeader(key, value) { this.headers.set(String(key).toLowerCase(), String(value)); },
        status(code) { this.statusCode = code; return this; },
        send(body) { this.body = String(body ?? ''); this.writableEnded = true; return this; },
        writeHead(code, headers = {}) { this.statusCode = code; Object.entries(headers).forEach(([key, value]) => this.setHeader(key, value)); },
        write(body) { this.body += String(body); },
        end(body = '') { this.body += String(body); this.writableEnded = true; }
    };
}

const vercelLoginResponse = createVercelResponse();
await vercelHandler({ url: '/login', method: 'GET', headers: { host: 'vercel.example.com' } }, vercelLoginResponse);
assert.equal(vercelLoginResponse.statusCode, 200);
assert.match(vercelLoginResponse.body, /请输入密码登录/);

const vercelTunnelResponse = createVercelResponse();
await vercelHandler({ url: '/tunnel', method: 'GET', headers: { host: 'vercel.example.com', upgrade: 'websocket' } }, vercelTunnelResponse);
assert.equal(vercelTunnelResponse.statusCode, 501);
assert.equal(vercelTunnelResponse.headers.get('content-type'), 'application/json;charset=utf-8');
assert.match(vercelTunnelResponse.body, /only available on Cloudflare Workers/);

console.log('All regression tests passed.');
