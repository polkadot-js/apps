// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TransportType } from '@polkadot/hw-ledger-transports/types';

import { useCallback, useMemo } from 'react';

import { LedgerGeneric } from '@polkadot/hw-ledger';
import { knownGenesis, knownLedger } from '@polkadot/networks/defaults';
import uiSettings from '@polkadot/ui-settings';
import { assert } from '@polkadot/util';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';

interface StateBase {
  hasLedgerChain: boolean;
  hasWebUsb: boolean;
  isLedgerCapable: boolean;
  isLedgerEnabled: boolean;
}

interface State extends StateBase {
  getLedger: () => LedgerGeneric;
}

const EMPTY_STATE: StateBase = {
  hasLedgerChain: false,
  hasWebUsb: false,
  isLedgerCapable: false,
  isLedgerEnabled: false
};

const hasWebUsb = !!(window as unknown as { USB?: unknown }).USB;
const ledgerChains = Object
  .keys(knownGenesis)
  .filter((n) => knownLedger[n]);
const ledgerHashes = ledgerChains.reduce<string[]>((all, n) => [...all, ...knownGenesis[n]], []);
let ledger: LedgerGeneric | null = null;
let ledgerType: TransportType | null = null;

function retrieveLedger (api: ApiPromise): LedgerGeneric {
  const currType = uiSettings.ledgerConn as TransportType;

  if (!ledger || ledgerType !== currType) {
    const genesisHex = api.genesisHash.toHex();
    const network = ledgerChains.find((network) => knownGenesis[network].includes(genesisHex));

    assert(network, `Unable to find a known Ledger config for genesisHash ${genesisHex}`);

    // All chains use the `slip44` from polkadot in their derivation path in ledger.
    // This interface is specific to the underlying PolkadotGenericApp.
    ledger = new LedgerGeneric(currType, network, knownLedger.polkadot);
    ledgerType = currType;
  }

  return ledger;
}

function getState (api: ApiPromise): StateBase {
  const hasLedgerChain = ledgerHashes.includes(api.genesisHash.toHex());
  const isLedgerCapable = hasWebUsb && hasLedgerChain;

  return {
    hasLedgerChain,
    hasWebUsb,
    isLedgerCapable,
    isLedgerEnabled: isLedgerCapable && uiSettings.ledgerConn !== 'none'
  };
}

function useLedgerImpl (): State {
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

export const useLedger = createNamedHook('useLedger', useLedgerImpl);
