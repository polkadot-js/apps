// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { LedgerTypes } from '@polkadot/hw-ledger/types';

import { useCallback, useMemo } from 'react';

import { Ledger } from '@polkadot/hw-ledger';
import { knownGenesis, knownLedger } from '@polkadot/networks/defaults';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import { useApi } from './useApi';

interface StateBase {
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
}

interface State extends StateBase {
  getLedger: () => Ledger;
}

const EMPTY_STATE: StateBase = {
  isLedgerCapable: false,
  isLedgerEnabled: false
};

const hasWebUsb = !!(window as unknown as { USB?: unknown }).USB;
const genesisChains = Object.keys(knownGenesis);
const genesisHashes = Object.values(knownGenesis).reduce((all, hashes) => [...all, ...hashes], []);
let ledger: Ledger | null = null;
let ledgerType: LedgerTypes | null = null;

function retrieveLedger (api: ApiPromise): Ledger {
  const currType = uiSettings.ledgerConn as LedgerTypes;

  if (!ledger || ledgerType !== currType) {
    const genesisHex = api.genesisHash.toHex();
    const network = genesisChains.find((network) => knownGenesis[network][0] === genesisHex);

    assert(network && knownLedger[network], `Unable to find a known Ledger config for genesisHash ${genesisHex}`);

    ledger = new Ledger(currType, network);
    ledgerType = currType;
  }

  return ledger;
}

function getState (api: ApiPromise): StateBase {
  const isLedgerCapable = hasWebUsb && genesisHashes.includes(api.genesisHash.toHex());

  return {
    isLedgerCapable,
    isLedgerEnabled: isLedgerCapable && uiSettings.ledgerConn !== 'none'
  };
}

export function useLedger (): State {
  const { api, isApiReady } = useApi();

  const getLedger = useCallback(
    () => retrieveLedger(api),
    [api]
  );

  return useMemo(
    () => ({ ...(isApiReady ? getState(api) : EMPTY_STATE), getLedger }),
    [api, getLedger, isApiReady]
  );
}
