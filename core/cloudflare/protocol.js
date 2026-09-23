function formatUuid(bytes) {
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isPrivateIpv4(host) {
    const parts = host.split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
    return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 ||
        (parts[0] === 169 && parts[1] === 254) ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127);
}

export function assertSafeDestination(host, port) {
    const normalized = String(host || '').toLowerCase().replace(/^\[|\]$/g, '');
    if (!normalized || normalized === 'localhost' || normalized.endsWith('.localhost') || normalized.endsWith('.internal')) {
        throw new Error('Private destinations are not allowed');
    }
    if (isPrivateIpv4(normalized) || normalized === '::1' || normalized.startsWith('fe80:') || normalized.startsWith('fc') || normalized.startsWith('fd')) {
        throw new Error('Private destinations are not allowed');
    }
    if (!Number.isInteger(port) || port < 1 || port > 65535 || port === 25) {
        throw new Error('Destination port is not allowed');
    }
}

export function parseVlessPacket(input, allowedUuids) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (bytes.length < 24) throw new Error('Invalid VLESS request');
    const version = bytes[0];
    const uuid = formatUuid(bytes.slice(1, 17)).toLowerCase();
    const allowed = String(allowedUuids || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
    if (!allowed.includes(uuid)) throw new Error('Unauthorized VLESS UUID');
    const optionLength = bytes[17];
    let offset = 18 + optionLength;
    if (bytes.length < offset + 4) throw new Error('Invalid VLESS request header');
    const command = bytes[offset++];
    const port = (bytes[offset++] << 8) | bytes[offset++];
    const addressType = bytes[offset++];
    let host;
    if (addressType === 1) {
        if (bytes.length < offset + 4) throw new Error('Invalid IPv4 address');
        host = Array.from(bytes.slice(offset, offset + 4)).join('.');
        offset += 4;
    } else if (addressType === 2) {
        const length = bytes[offset++];
        if (!length || bytes.length < offset + length) throw new Error('Invalid domain address');
        host = new TextDecoder().decode(bytes.slice(offset, offset + length));
        offset += length;
    } else if (addressType === 3) {
        if (bytes.length < offset + 16) throw new Error('Invalid IPv6 address');
        const groups = [];
        for (let index = 0; index < 16; index += 2) groups.push(((bytes[offset + index] << 8) | bytes[offset + index + 1]).toString(16));
        host = groups.join(':');
        offset += 16;
    } else {
        throw new Error('Unsupported VLESS address type');
    }
    if (command !== 1 && command !== 2) throw new Error('Unsupported VLESS command');
    if (command === 2 && port !== 53) throw new Error('UDP forwarding is limited to DNS');
    assertSafeDestination(host, port);
    return { version, uuid, command, host, port, payload: bytes.slice(offset) };
}

export function decodeEarlyData(value) {
    if (!value) return new Uint8Array();
    try {
        const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
        const binary = atob(padded);
        return Uint8Array.from(binary, character => character.charCodeAt(0));
    } catch {
        return new Uint8Array();
    }
}
