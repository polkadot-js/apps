// Copyright 2017-2020 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
