// Copyright 2017-2020 @polkadot/react-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Ledger } from '@polkadot/ui-keyring';
import uiSettings from '@polkadot/ui-settings';

import { assert } from '@polkadot/util';
import { api } from './Api';
import networks from '@polkadot/networks';

function getGenesis (name: string): string {
  const network = networks.find(({ network }) => network === name);

  assert(network && network.genesisHash[0], `Unable to find genesisHash for ${name}`);

  return network.genesisHash[0];
}

const KUSAMA_GENESIS = getGenesis('kusama');

const POLKADOT_GENESIS = getGenesis('polkadot');

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

    if (def != null) {
      ledger = new Ledger(uiSettings.ledgerConn as 'u2f', def[1]);
    }
  }

  return ledger as Ledger;
}