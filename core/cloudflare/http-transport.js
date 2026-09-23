import { parseVlessPacket } from './protocol.js';
import { openTcpConnection, socketReadableStream, writeSocket } from './tcp.js';

function encodeGrpcFrame(chunk) {
    const output = new Uint8Array(5 + chunk.length);
    output[0] = 0;
    new DataView(output.buffer).setUint32(1, chunk.length);
    output.set(chunk, 5);
    return output;
}

function decodeGrpcFrame(bytes) {
    if (bytes.length < 5 || bytes[0] !== 0) throw new Error('Invalid gRPC frame');
    const length = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(1);
    if (length < 1 || bytes.length < 5 + length) throw new Error('Incomplete gRPC frame');
    return bytes.slice(5, 5 + length);
}

export async function handleHttpTransport(request, allowedUuids, grpc = false, connect) {
    const rawBody = new Uint8Array(await request.arrayBuffer());
    const packet = grpc ? decodeGrpcFrame(rawBody) : rawBody;
    const requestInfo = parseVlessPacket(packet, allowedUuids);
    if (requestInfo.command !== 1) throw new Error('HTTP transport supports TCP only');
    const socket = await openTcpConnection(requestInfo.host, requestInfo.port, connect);
    await writeSocket(socket, requestInfo.payload);
    const responseHeader = new Uint8Array([requestInfo.version, 0]);
    const body = socketReadableStream(socket, responseHeader, grpc ? encodeGrpcFrame : value => value);
    return new Response(body, {
        status: 200,
        headers: {
            'Content-Type': grpc ? 'application/grpc' : 'application/octet-stream',
            'Cache-Control': 'no-store'
        }
    });
}
