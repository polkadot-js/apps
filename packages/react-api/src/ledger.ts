// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';

import chains from '@polkadot/ui-settings/defaults/chains';

import { api } from './Api';

const ALLOWED_CHAINS = chains.kusama;

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
