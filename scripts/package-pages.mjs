import { execFile } from 'node:child_process';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const projectRoot = new URL('../', import.meta.url);
const tempDirectory = await mkdtemp(join(tmpdir(), 'am-cf-tunnel-sub-'));
const workerFile = join(tempDirectory, '_worker.js');
const outputFile = new URL('../_worker.src.js.zip', import.meta.url);

try {
    await cp(new URL('../_worker.src.js', import.meta.url), workerFile);
    await execFileAsync('zip', ['-j', '-FS', outputFile.pathname, workerFile]);
    console.log(`Created ${outputFile.pathname}`);
} finally {
    await rm(tempDirectory, { recursive: true, force: true });
}
