// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const WASM_MAGIC = new Uint8Array([0, 97, 115, 109]);

function isWasm (value: Uint8Array): boolean {
  return u8aEq(wasm.subarray(0, 4), WASM_MAGIC);
}
