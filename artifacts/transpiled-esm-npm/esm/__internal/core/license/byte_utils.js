/* eslint-disable no-bitwise */
export function base64ToBytes(base64) {
  return new Uint8Array(atob(base64).split('').map(s => s.charCodeAt(0)));
}
export function hexToBytes(string) {
  var _a, _b;
  return new Uint8Array((_b = (_a = string.match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.map(byte => parseInt(byte, 16))) !== null && _b !== void 0 ? _b : []);
}
export function stringToBytes(string) {
  var bytes = new Uint8Array(string.length);
  for (var k = 0; k < string.length; k += 1) {
    bytes[k] = string.charCodeAt(k) & 0xFF;
  }
  return bytes;
}
export function wordsToBytes(words) {
  var bytes = new Uint8Array(words.length * 4);
  for (var k = 0; k < bytes.length; k += 1) {
    bytes[k] = words[k >> 2] >>> 8 * (3 - k % 4);
  }
  return bytes;
}
export function bytesToWords(bytes) {
  var words = new Uint32Array((bytes.length - 1 >> 2) + 1);
  for (var k = 0; k < bytes.length; k += 1) {
    words[k >> 2] |= bytes[k] << 8 * (3 - k % 4);
  }
  return words;
}
export function wordsToHex(words) {
  return [...words].map(w => w.toString(16).padStart(8, '0')).join('');
}
export function bytesToHex(bytes) {
  return [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
}
export function leftRotate(x, n) {
  return (x << n | x >>> 32 - n) >>> 0;
}
export function concatBytes(a, b) {
  var result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}