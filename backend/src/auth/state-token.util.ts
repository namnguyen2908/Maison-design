import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const SIGNING_ALGO = 'sha256';

export function signStateToken(redirectUrl: string, secret: string): string {
  const payload = JSON.stringify({
    url: redirectUrl,
    nonce: randomBytes(12).toString('hex'),
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = createHmac(SIGNING_ALGO, secret)
    .update(encoded)
    .digest('hex');
  return `${encoded}.${signature}`;
}

export function verifyStateToken(
  token: string,
  secret: string,
): string | null {
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;

  const encoded = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expectedSig = createHmac(SIGNING_ALGO, secret)
    .update(encoded)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');

  if (
    sigBuf.length !== expBuf.length ||
    !timingSafeEqual(sigBuf, expBuf)
  ) {
    return null;
  }

  try {
    const { url } = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    return typeof url === 'string' && url.startsWith('http') ? url : null;
  } catch {
    return null;
  }
}

export function getAllowedOrigins(csv: string | undefined): string[] {
  if (!csv) return [];
  return csv
    .split(',')
    .map((u) => u.trim().replace(/\/+$/, ''))
    .filter((u) => u.startsWith('http'));
}

export function resolveRedirectUrl(
  stateToken: string | undefined,
  fallbackOrigins: string[],
  secret: string,
): string {
  if (stateToken) {
    const url = verifyStateToken(stateToken, secret);
    if (url) return url;
  }

  return fallbackOrigins[0] ?? '/';
}
