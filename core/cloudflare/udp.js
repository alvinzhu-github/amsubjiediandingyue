function concat(chunks) {
    const size = chunks.reduce((total, chunk) => total + chunk.length, 0);
    const output = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
        output.set(chunk, offset);
        offset += chunk.length;
    }
    return output;
}

export async function forwardDnsPackets(data, responseHeader, send, includeHeader = true) {
    let offset = 0;
    let first = includeHeader;
    while (offset + 2 <= data.length) {
        const length = (data[offset] << 8) | data[offset + 1];
        offset += 2;
        if (!length || offset + length > data.length) throw new Error('Invalid DNS UDP packet');
        const query = data.slice(offset, offset + length);
        offset += length;
        const response = await fetch('https://1.1.1.1/dns-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/dns-message', Accept: 'application/dns-message' },
            body: query
        });
        if (!response.ok) throw new Error(`DNS upstream returned ${response.status}`);
        const answer = new Uint8Array(await response.arrayBuffer());
        const prefix = new Uint8Array([answer.length >> 8, answer.length & 255]);
        await send(concat(first ? [responseHeader, prefix, answer] : [prefix, answer]));
        first = false;
    }
    return false;
}
