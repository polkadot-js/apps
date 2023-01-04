// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { nextTick, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

export interface UseAccounts {
  allAccounts: string[];
  allAccountsHex: string[];
  areAccountsLoaded: boolean
  hasAccounts: boolean;
  isAccount: (address?: string | null) => boolean;
}

const EMPTY: UseAccounts = { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: () => false };

function extractAccounts (accounts: SubjectInfo = {}): UseAccounts {
  const allAccounts = Object.keys(accounts);
  const allAccountsHex = allAccounts.map((a) => u8aToHex(decodeAddress(a)));
  const hasAccounts = allAccounts.length !== 0;
  const isAccount = (address?: string | null) => !!address && allAccounts.includes(address);

  return { allAccounts, allAccountsHex, areAccountsLoaded: true, hasAccounts, isAccount };
}

function useAccountsImpl (): UseAccounts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>(EMPTY);

  useEffect((): () => void => {
    const subscription = keyring.accounts.subject.subscribe((accounts = {}) =>
      mountedRef.current && setState(extractAccounts(accounts))
    );

    return (): void => {
      nextTick(() => subscription.unsubscribe());
    };
  }, [mountedRef]);

  return state;
}

export const useAccounts = createNamedHook('useAccounts', useAccountsImpl);
