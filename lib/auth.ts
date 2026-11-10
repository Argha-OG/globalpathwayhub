import crypto from 'crypto';
import { query } from '@/lib/db';

const SALT = process.env.AUTH_SALT || 'gph_secure_salt_2026';

export function hashPassword(password, salt = SALT) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password, hash, salt = SALT) {
  const computed = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}

export function generateSessionToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    timestamp: Date.now(),
  };
  const str = JSON.stringify(payload);
  const signature = crypto.createHmac('sha256', SALT).update(str).digest('hex');
  return Buffer.from(str).toString('base64url') + '.' + signature;
}

export function verifySessionToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [dataPart, sigPart] = parts;

  try {
    const jsonStr = Buffer.from(dataPart, 'base64url').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', SALT).update(jsonStr).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(sigPart), Buffer.from(expectedSig))) {
      return null;
    }

    const payload = JSON.parse(jsonStr);
    // 7 days token expiration
    if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const res = await query('SELECT id, name, email, role, phone, branch, commission_rate, status FROM users WHERE id = $1', [payload.id]);
  if (!res.rows[0] || res.rows[0].status !== 'active') return null;

  const u = res.rows[0];
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    branch: u.branch,
    commissionRate: Number(u.commission_rate || 0),
  };
}
