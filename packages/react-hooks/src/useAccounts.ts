// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import useIsMountedRef from './useIsMountedRef';

interface UseAccounts {
  allAccounts: string[];
  hasAccounts: boolean;
  isAccount: (address: string) => boolean;
}

export default function useAccounts (): UseAccounts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({ allAccounts: [], hasAccounts: false, isAccount: () => false });

  useEffect((): () => void => {
    const subscription = accountObservable.subject.subscribe((accounts): void => {
      if (mountedRef.current) {
        const allAccounts = accounts ? Object.keys(accounts) : [];
        const hasAccounts = allAccounts.length !== 0;
        const isAccount = (address: string): boolean => allAccounts.includes(address);

        setState({ allAccounts, hasAccounts, isAccount });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return state;
}
