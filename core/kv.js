function getKvEnvVar(key, env) {
    if (env && typeof env[key] !== 'undefined') {
        return env[key];
    }
    if (typeof process !== 'undefined' && process.env && typeof process.env[key] !== 'undefined') {
        return process.env[key];
    }
    return undefined;
}

export function getKvBinding(env) {
    const binding = env?.ips || env?.KV;
    if (binding && typeof binding.get === 'function' && typeof binding.put === 'function') {
        return binding;
    }
    return null;
}

async function cfKvRestPut(env, key, value) {
    const namespaceId = getKvEnvVar('CF_NAMESPACE_ID', env);
    const accountId = getKvEnvVar('CF_ACCOUNT_ID', env);
    const email = getKvEnvVar('CF_EMAIL', env);
    const apiKey = getKvEnvVar('CF_API_KEY', env);
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'X-Auth-Email': email,
            'X-Auth-Key': apiKey,
            'Content-Type': 'text/plain'
        },
        body: value
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error(JSON.stringify(data));
    }
}

async function cfKvRestGet(env, key) {
    const namespaceId = getKvEnvVar('CF_NAMESPACE_ID', env);
    const accountId = getKvEnvVar('CF_ACCOUNT_ID', env);
    const email = getKvEnvVar('CF_EMAIL', env);
    const apiKey = getKvEnvVar('CF_API_KEY', env);
    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Auth-Email': email,
            'X-Auth-Key': apiKey
        }
    });
    if (response.status === 404) return null;
    return await response.text();
}

export async function saveToKV(env, key, value, res = null) {
    const binding = getKvBinding(env);
    if (binding) {
        await binding.put(key, value);
        return;
    }
    await cfKvRestPut(env, key, value);
}

export async function loadFromKV(env, key, res = null) {
    try {
        const binding = getKvBinding(env);
        if (binding) return await binding.get(key);
        return await cfKvRestGet(env, key);
    } catch {
        return null;
    }
}

export async function appendToKV(env, key, appendText, res = null) {
    const existing = await loadFromKV(env, key, res);
    const existingItems = existing ? existing.split('\n').map(value => value.trim()).filter(Boolean) : [];
    const appendedItems = appendText.split('\n').map(value => value.trim()).filter(Boolean);
    const merged = [...new Set([...existingItems, ...appendedItems])].join('\n');
    await saveToKV(env, key, merged, res);
}
