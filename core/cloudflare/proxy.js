import { handleGrpcTransport } from './grpc.js';
import { handleHttpTransport } from './http-transport.js';
import { handleWebSocketTransport } from './websocket.js';

export function detectCloudflareTransport(request, url) {
    const getHeader = name => {
        if (typeof request.headers?.get === 'function') return request.headers.get(name) || '';
        return request.headers?.[name.toLowerCase()] || request.headers?.[name] || '';
    };
    const upgrade = String(getHeader('Upgrade')).toLowerCase();
    if (upgrade === 'websocket') return 'websocket';
    if (String(request.method || '').toUpperCase() !== 'POST') return null;
    const contentType = String(getHeader('Content-Type')).toLowerCase();
    if (contentType.startsWith('application/grpc')) return 'grpc';
    const explicitTransport = String(getHeader('X-Amclubs-Transport') || url.searchParams.get('transport') || '').toLowerCase();
    if (explicitTransport === 'xhttp' || explicitTransport === 'http') return 'http';
    return null;
}

function errorResponse(message, status) {
    return new Response(JSON.stringify({ ok: false, error: message }), {
        status,
        headers: { 'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store' }
    });
}

export async function handleCloudflareProxyRequest({ request, url, allowedUuids, runtime, connect }) {
    const transport = detectCloudflareTransport(request, url);
    if (!transport) return null;
    if (runtime !== 'cloudflare') {
        return errorResponse(`${transport} transport is only available on Cloudflare Workers`, 501);
    }
    if (!allowedUuids) return errorResponse('UUID is required for transport authentication', 503);
    try {
        if (transport === 'websocket') return await handleWebSocketTransport(request, allowedUuids, connect);
        if (transport === 'grpc') return await handleGrpcTransport(request, allowedUuids, connect);
        return await handleHttpTransport(request, allowedUuids, false, connect);
    } catch (error) {
        return errorResponse(error.message || String(error), /Unauthorized/.test(error.message) ? 403 : 400);
    }
}
