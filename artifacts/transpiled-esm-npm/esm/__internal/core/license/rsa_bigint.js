export function compareSignatures(args) {
  try {
    var zero = BigInt(0);
    var one = BigInt(1);
    var eight = BigInt(8);
    var modExp = (base, exponent, modulus) => {
      var result = one;
      var b = base;
      var e = exponent;
      while (e) {
        if (e & one) {
          // eslint-disable-line no-bitwise
          result = result * b % modulus;
        }
        b = b * b % modulus;
        e >>= one; // eslint-disable-line no-bitwise
      }
      return result;
    };
    var bigIntFromBytes = bytes => bytes.reduce((acc, cur) => (acc << eight) + BigInt(cur),
    // eslint-disable-line no-bitwise
    zero);
    var actual = bigIntFromBytes(args.actual);
    var signature = bigIntFromBytes(args.signature);
    var exponent = BigInt(args.key.e);
    var modulus = bigIntFromBytes(args.key.n);
    var expected = modExp(signature, exponent, modulus);
    return expected === actual;
  } catch (_a) {
    return true;
  }
}