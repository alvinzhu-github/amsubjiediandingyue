import { decodeEarlyData, parseVlessPacket } from './protocol.js';
import { openTcpConnection } from './tcp.js';
import { forwardDnsPackets } from './udp.js';

function toBytes(data) {
    if (data instanceof Uint8Array) return data;
    if (data instanceof ArrayBuffer) return new Uint8Array(data);
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (typeof data === 'string') return new TextEncoder().encode(data);
    throw new Error('Unsupported WebSocket payload');
}

function closeQuietly(webSocket, code = 1000, reason = '') {
    try {
        if (webSocket.readyState === 1) webSocket.close(code, reason.slice(0, 120));
    } catch {}
}

export async function handleWebSocketTransport(request, allowedUuids, connect) {
    if (typeof WebSocketPair === 'undefined') throw new Error('WebSocketPair is unavailable');
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();

    let initialized = false;
    let socket;
    let socketWriter;
    let udpMode = false;
    let dnsHeaderPending = true;
    let queue = Promise.resolve();

    const send = async data => {
        if (server.readyState === 1) server.send(data);
    };

    async function pipeRemote(readable, responseHeader) {
        const reader = readable.getReader();
        let headerPending = true;
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                let chunk = toBytes(value);
                if (headerPending) {
                    const merged = new Uint8Array(responseHeader.length + chunk.length);
                    merged.set(responseHeader);
                    merged.set(chunk, responseHeader.length);
                    chunk = merged;
                    headerPending = false;
                }
                await send(chunk);
            }
            closeQuietly(server);
        } catch (error) {
            closeQuietly(server, 1011, error.message);
        } finally {
            reader.releaseLock();
        }
    }

    async function handleChunk(chunk) {
        const bytes = toBytes(chunk);
        if (!initialized) {
            const requestInfo = parseVlessPacket(bytes, allowedUuids);
            const responseHeader = new Uint8Array([requestInfo.version, 0]);
            initialized = true;
            if (requestInfo.command === 2) {
                udpMode = true;
                dnsHeaderPending = await forwardDnsPackets(requestInfo.payload, responseHeader, send, dnsHeaderPending);
                return;
            }
            socket = await openTcpConnection(requestInfo.host, requestInfo.port, connect);
            socketWriter = socket.writable.getWriter();
            if (requestInfo.payload.length) await socketWriter.write(requestInfo.payload);
            pipeRemote(socket.readable, responseHeader);
            return;
        }
        if (udpMode) {
            dnsHeaderPending = await forwardDnsPackets(bytes, new Uint8Array(), send, dnsHeaderPending);
            return;
        }
        if (!socketWriter) throw new Error('TCP socket is unavailable');
        await socketWriter.write(bytes);
    }

    server.addEventListener('message', event => {
        queue = queue.then(() => handleChunk(event.data)).catch(error => closeQuietly(server, 1008, error.message));
    });
    server.addEventListener('close', () => {
        try { socketWriter?.releaseLock(); } catch {}
        socket?.close?.().catch?.(() => {});
    });
    server.addEventListener('error', () => closeQuietly(server, 1011, 'WebSocket error'));

    const earlyData = decodeEarlyData(request.headers.get('Sec-WebSocket-Protocol') || '');
    if (earlyData.length) queue = queue.then(() => handleChunk(earlyData)).catch(error => closeQuietly(server, 1008, error.message));

    return new Response(null, { status: 101, webSocket: client });
}
