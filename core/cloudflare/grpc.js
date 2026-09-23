import { handleHttpTransport } from './http-transport.js';

export function handleGrpcTransport(request, allowedUuids, connect) {
    return handleHttpTransport(request, allowedUuids, true, connect);
}
