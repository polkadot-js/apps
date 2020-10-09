// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { hexToU8a } from '@polkadot/util';

import { publicToAddr, recoverFromJSON } from './util';

describe('util', (): void => {
  it('converts a publicKey to address via publicToAddr', (): void => {
    expect(
      publicToAddr(
        hexToU8a(
          '0x836b35a026743e823a90a0ee3b91bf615c6a757e2b60b9e1dc1826fd0dd16106f7bc1e8179f665015f43c6c81f39062fc2086ed849625c06e04697698b21855e'
        )
      )
    ).toEqual('0x0BED7ABd61247635c1973eB38474A2516eD1D884');
  });

  it('converts to valid signature via recoverFromJSON', (): void => {
    expect(
      JSON.stringify(recoverFromJSON('{"address":"0x002309df96687e44280bb72c3818358faeeb699c","msg":"Pay KSMs to the Kusama account:88dc3417d5058ec4b4503e0c12ea1a0a89be200fe98922423d4334014fa6b0ee","sig":"0x55bd020bdbbdc02de34e915effc9b18a99002f4c29f64e22e8dcbb69e722ea6c28e1bb53b9484063fbbfd205e49dcc1f620929f520c9c4c3695150f05a28f52a01","version":"2"}'))
    ).toEqual('{"error":null,"ethereumAddress":"0x002309df96687e44280bb72c3818358faeeb699c","signature":"0x55bd020bdbbdc02de34e915effc9b18a99002f4c29f64e22e8dcbb69e722ea6c28e1bb53b9484063fbbfd205e49dcc1f620929f520c9c4c3695150f05a28f52a01"}');
  });
});
