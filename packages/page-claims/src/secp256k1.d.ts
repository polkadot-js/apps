// Copyright 2017-2022 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

declare module 'secp256k1/elliptic' {
  export function publicKeyConvert (publicKey: Buffer, expanded: boolean): Buffer;
  export function recover (msgHash: Buffer, signature: Buffer, recovery: number): Buffer;
}
