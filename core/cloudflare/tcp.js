export async function openTcpConnection(host, port, connect) {
    if (typeof connect !== 'function') throw new Error('Cloudflare TCP connector is unavailable');
    return connect({ hostname: host, port });
}

export async function writeSocket(socket, data) {
    if (!data || data.byteLength === 0) return;
    const writer = socket.writable.getWriter();
    try {
        await writer.write(data);
    } finally {
        writer.releaseLock();
    }
}

export function socketReadableStream(socket, responseHeader, encodeChunk = value => value) {
    const reader = socket.readable.getReader();
    let headerPending = true;
    return new ReadableStream({
        async pull(controller) {
            try {
                const { value, done } = await reader.read();
                if (done) {
                    controller.close();
                    reader.releaseLock();
                    return;
                }
                let chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
                if (headerPending) {
                    const merged = new Uint8Array(responseHeader.length + chunk.length);
                    merged.set(responseHeader);
                    merged.set(chunk, responseHeader.length);
                    chunk = merged;
                    headerPending = false;
                }
                controller.enqueue(encodeChunk(chunk));
            } catch (error) {
                controller.error(error);
            }
        },
        cancel() {
            reader.cancel().catch(() => {});
            socket.close?.().catch?.(() => {});
        }
    });
}
