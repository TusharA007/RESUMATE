import crypto from 'node:crypto';

const settings = {
  keylen: 64,
  options: { N: 16384, r: 8, p: 1 }
};

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, settings.keylen, settings.options).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedValue) {
  const [salt, storedHash] = String(storedValue || '').split(':');
  if (!salt || !storedHash) return false;
  const hash = crypto.scryptSync(password, salt, settings.keylen, settings.options);
  const storedBuffer = Buffer.from(storedHash, 'hex');
  return storedBuffer.length === hash.length && crypto.timingSafeEqual(storedBuffer, hash);
}
