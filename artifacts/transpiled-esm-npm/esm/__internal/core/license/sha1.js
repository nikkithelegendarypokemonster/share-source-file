/* eslint-disable no-bitwise */
import { bytesToWords, leftRotate, stringToBytes, wordsToBytes } from './byte_utils';
export function preprocess(text) {
  var bytes = new Uint8Array(text.length + 1);
  bytes.set(stringToBytes(text));
  bytes[bytes.length - 1] = 0x80;
  var words = bytesToWords(new Uint8Array(bytes));
  var result = new Uint32Array(Math.ceil((words.length + 2) / 16) * 16);
  result.set(words, 0);
  result[result.length - 1] = (bytes.length - 1) * 8;
  return result;
}
export function sha1(text) {
  var message = preprocess(text);
  var h = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
  for (var i = 0; i < message.length; i += 16) {
    var w = new Uint32Array(80);
    for (var j = 0; j < 16; j += 1) {
      w[j] = message[i + j];
    }
    for (var _j = 16; _j < 80; _j += 1) {
      var n = w[_j - 3] ^ w[_j - 8] ^ w[_j - 14] ^ w[_j - 16];
      w[_j] = n << 1 | n >>> 31;
    }
    var a = h[0];
    var b = h[1];
    var c = h[2];
    var d = h[3];
    var e = h[4];
    for (var _j2 = 0; _j2 < 80; _j2 += 1) {
      var [f, k] = _j2 < 20 ? [b & c | ~b & d, 0x5A827999] // eslint-disable-line no-nested-ternary, max-len
      : _j2 < 40 ? [b ^ c ^ d, 0x6ED9EBA1] // eslint-disable-line no-nested-ternary, max-len
      : _j2 < 60 ? [b & c | b & d | c & d, 0x8F1BBCDC] // eslint-disable-line no-nested-ternary, max-len
      : [b ^ c ^ d, 0xCA62C1D6];
      var temp = leftRotate(a, 5) + f + e + k + w[_j2];
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }
    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
  }
  return wordsToBytes(h);
}