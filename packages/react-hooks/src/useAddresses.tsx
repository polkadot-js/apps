// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';

import useIsMountedRef from './useIsMountedRef';

interface UseAccounts {
  allAddresses: string[];
  hasAddresses: boolean;
}

export default function useAccounts (): UseAccounts {
  const mounted = useIsMountedRef();
  const [state, setState] = useState<UseAccounts>({ allAddresses: [], hasAddresses: false });

  useEffect((): () => void => {
    const subscription = addressObservable.subject.subscribe((addresses): void => {
      if (mounted.current) {
        const allAddresses = addresses ? Object.keys(addresses) : [];
        const hasAddresses = allAddresses.length !== 0;

        setState({ allAddresses, hasAddresses });
      }
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
