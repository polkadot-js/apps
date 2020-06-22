// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';

import { api } from './Api';

const ALLOWED_CHAINS = [
  '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe', // Kusama CC3
  '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3' // Polkadot CC1
];

let ledger: Ledger | null = null;

export function isLedgerCapable (): boolean {
  try {
    return !!api && ALLOWED_CHAINS.includes(api.genesisHash.toHex());
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
    ledger = new Ledger(uiSettings.ledgerConn as 'u2f');
  }

  return ledger;
}
