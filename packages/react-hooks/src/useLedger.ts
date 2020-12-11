// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Ledger } from '@polkadot/ui-keyring';

import { useCallback, useMemo } from 'react';

import { ledgerChains } from '@polkadot/apps-config';
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
let ledger: Ledger | null = null;

function retrieveLedger (api: ApiPromise): Ledger {
  if (!ledger) {
    const def = ledgerChains.find(([g]) => g === api.genesisHash.toHex());

    assert(def, `Unable to find supported chain for ${api.genesisHash.toHex()}`);

    ledger = new Ledger(uiSettings.ledgerConn as 'u2f', def[1]);
  }

  return ledger;
}

function getState (api: ApiPromise): StateBase {
  const isLedgerCapable = hasWebUsb && ledgerChains.map(([g]) => g).includes(api.genesisHash.toHex());

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
