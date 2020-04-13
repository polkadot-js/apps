// Copyright 2017-2020 @polkadot/app-claims authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

declare module 'secp256k1/elliptic' {
  export function publicKeyConvert (publicKey: Buffer, expanded: boolean): Buffer;
  export function recover (msgHash: Buffer, signature: Buffer, recovery: number): Buffer;
}
