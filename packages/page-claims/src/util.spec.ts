// Copyright 2017-2026 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { statics } from '@polkadot/react-api/statics';
import { hexToU8a } from '@polkadot/util';

import { getStatement, POLKADOT_CLAIMS_PREFIX, publicToAddr, recoverFromJSON } from './util.js';

// StatementKind::to_text in polkadot/runtime/common/src/claims, verbatim
const REGULAR = 'I hereby agree to the terms of the statement whose SHA-256 multihash is Qmc1XYqT6S39WNp2UeiRUrZichUWUPpGEThDE6dAb3f6Ny. (This may be found at the URL: https://statement.polkadot.network/regular.html)';
const SAFT = 'I hereby agree to the terms of the statement whose SHA-256 multihash is QmXEkMahfhHJPzT3RjkXiZVFi77ZeVeuxtAjhojGRNYckz. (This may be found at the URL: https://statement.polkadot.network/saft.html)';

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
    ).toEqual('{"error":null,"ethereumAddress":"0x002309DF96687e44280BB72c3818358FAEeB699c","signature":"0x55bd020bdbbdc02de34e915effc9b18a99002f4c29f64e22e8dcbb69e722ea6c28e1bb53b9484063fbbfd205e49dcc1f620929f520c9c4c3695150f05a28f52a01"}');
  });

  it('returns the statements for the Polkadot claims prefix via getStatement, whatever the chain is called', (): void => {
    expect(POLKADOT_CLAIMS_PREFIX).toEqual('Pay DOTs to the Polkadot account:');
    expect(getStatement(POLKADOT_CLAIMS_PREFIX, statics.registry.createType('StatementKind', 'Regular'))?.sentence).toEqual(REGULAR);
    expect(getStatement(POLKADOT_CLAIMS_PREFIX, statics.registry.createType('StatementKind', 'Saft'))?.sentence).toEqual(SAFT);
  });

  it('returns no statement via getStatement for another prefix or without a kind', (): void => {
    expect(getStatement('Pay KSMs to the Kusama account:', statics.registry.createType('StatementKind', 'Regular'))).toEqual(undefined);
    expect(getStatement(POLKADOT_CLAIMS_PREFIX, null)).toEqual(undefined);
  });
});
