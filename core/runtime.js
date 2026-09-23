export function getRuntime(env, res = null) {
    if (res && typeof res.setHeader === 'function') {
        return 'vercel';
    }
    const hasCloudflareApis = typeof WebSocketPair !== 'undefined' ||
        (typeof caches !== 'undefined' && Boolean(caches.default));
    if (hasCloudflareApis && env && typeof env === 'object') {
        return 'cloudflare';
    }
    const isNode = typeof process !== 'undefined' && process.release?.name === 'node';
    if (!isNode && env && typeof env === 'object' && typeof Request !== 'undefined') {
        return 'cloudflare';
    }
    return 'unknown';
}

export function isCloudflareRuntime(env, res = null) {
    return getRuntime(env, res) === 'cloudflare';
}
