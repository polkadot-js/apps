// Copyright 2017-2024 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { TransportType } from '@polkadot/hw-ledger-transports/types';

import { useCallback, useMemo } from 'react';

import { Ledger } from '@polkadot/hw-ledger';
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
  getLedger: () => Ledger;
}

const EMPTY_STATE: StateBase = {
  hasLedgerChain: false,
  hasWebUsb: false,
  isLedgerCapable: false,
  isLedgerEnabled: false
};

const availGenesis: typeof knownGenesis = {
  "avail-turing": ['0xd3d2f3a3495dc597434a99d7d449ebad6616db45e4e4f178f31cc6fa14378b70']
};
const newKnownGenesis: typeof knownGenesis = {
  ...knownGenesis,
  ...availGenesis
};

const availLedger: typeof knownLedger = {
  "avail-turing": 0x800002c5
};
const newKnownLedger: typeof knownLedger = {
  ...knownLedger,
  ...availLedger
};

const hasWebUsb = !!(window as unknown as { USB?: unknown }).USB;
const ledgerChains = Object
  .keys(newKnownGenesis)
  .filter((n) => newKnownLedger[n]);
const ledgerHashes = ledgerChains.reduce<string[]>((all, n) => [...all, ...newKnownGenesis[n]], []);
let ledger: Ledger | null = null;
let ledgerType: TransportType | null = null;

function retrieveLedger (api: ApiPromise): Ledger {
  const currType = uiSettings.ledgerConn as TransportType;

  if (!ledger || ledgerType !== currType) {
    const genesisHex = api.genesisHash.toHex();
    const network = ledgerChains.find((network) => newKnownGenesis[network].includes(genesisHex));

    assert(network, `Unable to find a known Ledger config for genesisHash ${genesisHex}`);

    ledger = new Ledger(currType, network);
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
