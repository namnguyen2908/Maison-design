import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const command = process.argv[2] ?? 'dev';
const extraArgs = process.argv.slice(3);
const envPath = join(process.cwd(), '.env');

if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    process.env[key] ??= value;
  }
}

const port = process.env.PORT ?? '3002';
const executable = process.platform === 'win32' ? 'next.cmd' : 'next';
const result = spawnSync(executable, [command, '--port', port, ...extraArgs], {
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
