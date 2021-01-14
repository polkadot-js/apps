// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import networks from '@polkadot/networks';
import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import { api } from './Api';

let ledger: Ledger | null = null;
const ledgerChains = networks.filter((network) => network.hasLedgerSupport);

export function isLedgerCapable (): boolean {
  try {
    return (
      !!(window as unknown as { USB?: unknown }).USB &&
      !!api && ledgerChains.map(({ genesisHash }) => genesisHash[0]).includes(api.genesisHash.toHex())
    );
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
    const genesisHex = api.genesisHash.toHex();
    const def = api && ledgerChains.find(({ genesisHash }) => genesisHash[0] === genesisHex);

    assert(def, `Unable to find supported chain for ${genesisHex}`);

    ledger = new Ledger(uiSettings.ledgerConn as 'u2f', def.network);
  }

  return ledger;
}
