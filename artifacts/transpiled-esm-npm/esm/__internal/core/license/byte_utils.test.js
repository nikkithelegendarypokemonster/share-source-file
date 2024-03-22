/* eslint-disable max-len */
import { base64ToBytes, bytesToHex, bytesToWords, concatBytes, hexToBytes, leftRotate, stringToBytes, wordsToBytes, wordsToHex } from './byte_utils';
describe('byte utils', () => {
  it.each([{
    value: 0b1,
    count: 1,
    expected: 0b10
  }, {
    value: 0b1,
    count: 2,
    expected: 0b100
  }, {
    value: 0b1,
    count: 32,
    expected: 0b1
  }, {
    value: 0b11011111111111111111111111111110,
    count: 4,
    expected: 0b11111111111111111111111111101101
  } // eslint-disable-line max-len
  ])('performs left rotation', _ref => {
    var {
      value,
      count,
      expected
    } = _ref;
    expect(leftRotate(value, count)).toBe(expected);
  });
  it.each([{
    value: '',
    expected: []
  }, {
    value: 'L',
    expected: [76]
  }, {
    value: 'abc',
    expected: [97, 98, 99]
  }, {
    value: 'Lorem ipsum dolor sit amet',
    expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116]
  }])('gets bytes from string', _ref2 => {
    var {
      value,
      expected
    } = _ref2;
    expect(stringToBytes(value).toString()).toBe(expected.toString());
  });
  it.each([{
    value: '',
    expected: []
  }, {
    value: 'TA==',
    expected: [76]
  }, {
    value: 'YWJj',
    expected: [97, 98, 99]
  }, {
    value: 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQ=',
    expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116]
  }])('gets bytes from base64 string', _ref3 => {
    var {
      value,
      expected
    } = _ref3;
    expect(base64ToBytes(value)).toEqual(new Uint8Array(expected));
  });
  it.each([{
    value: '',
    expected: []
  }, {
    value: '4c',
    expected: [76]
  }, {
    value: '616263',
    expected: [97, 98, 99]
  }, {
    value: '4c6f72656d20697073756d20646f6c6f722073697420616d6574',
    expected: [76, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 32, 100, 111, 108, 111, 114, 32, 115, 105, 116, 32, 97, 109, 101, 116]
  }])('gets bytes from hex string', _ref4 => {
    var {
      value,
      expected
    } = _ref4;
    expect(hexToBytes(value)).toEqual(new Uint8Array(expected));
  });
  it.each([{
    value: [],
    expected: []
  }, {
    value: [0x4c000000],
    expected: [76, 0, 0, 0]
  }, {
    value: [0x4c6f0000],
    expected: [76, 111, 0, 0]
  }, {
    value: [0x4c6f7200],
    expected: [76, 111, 114, 0]
  }, {
    value: [0x4c6f7265],
    expected: [76, 111, 114, 101]
  }, {
    value: [0x4c6f7265, 0x6d000000],
    expected: [76, 111, 114, 101, 109, 0, 0, 0]
  }, {
    value: [0x66f7265, 0x6d206970, 0x73756d00],
    expected: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109, 0]
  } // eslint-disable-line max-len
  ])('converts words to bytes', _ref5 => {
    var {
      value,
      expected
    } = _ref5;
    expect(wordsToBytes(new Uint32Array(value))).toEqual(new Uint8Array(expected));
  });
  it.each([{
    value: [],
    expected: []
  }, {
    value: [76],
    expected: [0x4c000000]
  }, {
    value: [76, 111],
    expected: [0x4c6f0000]
  }, {
    value: [76, 111, 114],
    expected: [0x4c6f7200]
  }, {
    value: [76, 111, 114, 101],
    expected: [0x4c6f7265]
  }, {
    value: [76, 111, 114, 101, 109],
    expected: [0x4c6f7265, 0x6d000000]
  }, {
    value: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109],
    expected: [0x66f7265, 0x6d206970, 0x73756d00]
  } // eslint-disable-line max-len
  ])('converts bytes to words', _ref6 => {
    var {
      value,
      expected
    } = _ref6;
    expect(bytesToWords(new Uint8Array(value)).toString()).toBe(expected.toString());
  });
  it.each([{
    value: [],
    expected: ''
  }, {
    value: [0x4c6f7265],
    expected: '4c6f7265'
  }, {
    value: [0x66f7265, 0x6d206970, 0x73756d00],
    expected: '066f72656d20697073756d00'
  }])('converts words to hex string', _ref7 => {
    var {
      value,
      expected
    } = _ref7;
    expect(wordsToHex(new Uint32Array(value)).toString()).toBe(expected);
  });
  it.each([{
    value: [],
    expected: ''
  }, {
    value: [76, 111, 114, 101],
    expected: '4c6f7265'
  }, {
    value: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109],
    expected: '066f72656d20697073756d'
  }])('converts bytes to hex string', _ref8 => {
    var {
      value,
      expected
    } = _ref8;
    expect(bytesToHex(new Uint8Array(value)).toString()).toBe(expected);
  });
  it.each([{
    value1: [],
    value2: [],
    expected: []
  }, {
    value1: [6, 111, 114, 101, 109, 32],
    value2: [],
    expected: [6, 111, 114, 101, 109, 32]
  }, {
    value1: [],
    value2: [105, 112, 115, 117, 109],
    expected: [105, 112, 115, 117, 109]
  }, {
    value1: [6, 111, 114, 101, 109, 32],
    value2: [105, 112, 115, 117, 109],
    expected: [6, 111, 114, 101, 109, 32, 105, 112, 115, 117, 109]
  }])('concatenate byte arrays', _ref9 => {
    var {
      value1,
      value2,
      expected
    } = _ref9;
    expect(concatBytes(new Uint8Array(value1), new Uint8Array(value2))).toEqual(new Uint8Array(expected));
  });
});