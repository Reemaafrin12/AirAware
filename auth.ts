import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_TOKEN_KEY = 'authToken';
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Create a signed-looking token for the local authentication simulation. */
export function createSimulatedJwt(email: string): string {
  const issuedAt = Date.now();
  const payload = JSON.stringify({ sub: email, iat: issuedAt, exp: issuedAt + TOKEN_TTL_MS });
  const encodedPayload = encodeBase64(payload);
  return `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${encodedPayload}.${issuedAt}.simulated-signature`;
}

export function isSimulatedJwtValid(token: string | null): boolean {
  if (!token) return false;

  const issuedAtMatch = token.match(/\.([0-9]{10,})\.simulated-signature$/);
  if (!issuedAtMatch) return false;

  const issuedAt = Number(issuedAtMatch[1]);
  const age = Date.now() - issuedAt;
  return Number.isFinite(issuedAt) && age >= 0 && age < TOKEN_TTL_MS;
}

export async function getValidAuthToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (isSimulatedJwtValid(token)) return token;

    if (token) await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return null;
  } catch {
    return null;
  }
}

function encodeBase64(value: string): string {
  // React Native provides btoa; the fallback keeps this helper safe in test environments.
  if (typeof globalThis.btoa === 'function') return globalThis.btoa(encodeURIComponent(value));
  return value;
}
