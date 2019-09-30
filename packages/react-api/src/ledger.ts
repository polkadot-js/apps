// Copyright 2017-2019 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';

import { api } from './Api';

const ALLOWED_CHAINS = [
  '0x3fd7b9eb6a00376e5be61f01abb429ffb0b104be05eaff4d458da48fcd425baf', // Kusama CC1
  '0xe3777fa922cafbff200cadeaea1a76bd7898ad5b89f7848999058b50e715f636' // Kusama CC2
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
