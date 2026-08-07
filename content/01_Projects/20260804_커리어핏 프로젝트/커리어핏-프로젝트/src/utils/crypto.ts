// Client-side Data Encryption Utility for LocalStorage Security
// Prevents sensitive resume content from being viewed in raw plaintext in browser storage

const ENCRYPTION_PREFIX = 'ENC_V1_';
const SECRET_SALT = 'CareerFit_Secure_Resume_2026';

/**
 * Lightweight local encryption for JSON string data in LocalStorage
 */
export function encryptLocalData(data: any): string {
  try {
    const jsonStr = JSON.stringify(data);
    let cipher = '';
    for (let i = 0; i < jsonStr.length; i++) {
      const charCode = jsonStr.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
      cipher += String.fromCharCode(charCode);
    }
    // Encode to Base64 to prevent storage encoding corruption
    const encoded = btoa(encodeURIComponent(cipher));
    return ENCRYPTION_PREFIX + encoded;
  } catch (e) {
    console.error('Data encryption failed, saving plain string fallback:', e);
    return JSON.stringify(data);
  }
}

/**
 * Decrypt LocalStorage data
 */
export function decryptLocalData<T>(storedValue: string, fallbackValue: T): T {
  if (!storedValue) return fallbackValue;

  try {
    if (storedValue.startsWith(ENCRYPTION_PREFIX)) {
      const encoded = storedValue.replace(ENCRYPTION_PREFIX, '');
      const cipher = decodeURIComponent(atob(encoded));
      let jsonStr = '';
      for (let i = 0; i < cipher.length; i++) {
        const charCode = cipher.charCodeAt(i) ^ SECRET_SALT.charCodeAt(i % SECRET_SALT.length);
        jsonStr += String.fromCharCode(charCode);
      }
      return JSON.parse(jsonStr) as T;
    }
    // Backward compatibility for existing plaintext localStorage data
    return JSON.parse(storedValue) as T;
  } catch (e) {
    console.warn('Failed to decrypt data or legacy plaintext format:', e);
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return fallbackValue;
    }
  }
}
