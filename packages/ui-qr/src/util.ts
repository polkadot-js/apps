// Copyright 2017-2019 @polkadot/ui-qr authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function encodeNumber (value: number): Uint8Array {
  return new Uint8Array([value >> 8, value & 256]);
}

export function encodeString (value: string): Uint8Array {
  const u8a = new Uint8Array(value.length);

  for (let i = 0; i < value.length; i++) {
    u8a[i] = value.charCodeAt(i);
  }

  return u8a;
}

export function decodeString (value: Uint8Array): string {
  return value.reduce((str, code): string => {
    return str + String.fromCharCode(code);
  }, '');
}
