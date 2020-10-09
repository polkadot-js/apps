// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KUSAMA_GENESIS, POLKADOT_GENESIS } from '@polkadot/apps-config/api/constants';
import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import { api } from './Api';

const ALLOWED_CHAINS: [string, 'kusama' | 'polkadot'][] = [
  [KUSAMA_GENESIS, 'kusama'],
  [POLKADOT_GENESIS, 'polkadot']
];

let ledger: Ledger | null = null;

export function isLedgerCapable (): boolean {
  try {
    return !!(window as unknown as { USB?: unknown }).USB && !!api && ALLOWED_CHAINS.map(([g]) => g).includes(api.genesisHash.toHex());
  } catch (error) {
    return false;
  }
}

export function isLedger (): boolean {
  return isLedgerCapable() && uiSettings.ledgerConn !== 'none';
}

export function clearLedger (): void {
  ledger = null;
}

export function getLedger (): Ledger {
  if (!ledger) {
    const def = api && ALLOWED_CHAINS.find(([g]) => g === api.genesisHash.toHex());

    assert(def, `Unable to find supported chain for ${api.genesisHash.toHex()}`);

    ledger = new Ledger(uiSettings.ledgerConn as 'u2f', def[1]);
  }

  return ledger;
}
