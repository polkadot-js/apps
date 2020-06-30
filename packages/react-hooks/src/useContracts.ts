// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import contractObservable from '@polkadot/ui-keyring/observable/contracts';

import useIsMountedRef from './useIsMountedRef';

interface UseContracts {
  allContracts: string[];
  hasContracts: boolean;
  isContract: (address: string) => boolean;
}

export default function useContracts (): UseContracts {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseContracts>({ allContracts: [], hasContracts: false, isContract: () => false });

  useEffect((): () => void => {
    const subscription = contractObservable.subject.subscribe((contracts): void => {
      if (mountedRef.current) {
        const allContracts = contracts ? Object.keys(contracts) : [];
        const hasContracts = allContracts.length !== 0;
        const isContract = (address: string): boolean => allContracts.includes(address);

        setState({ allContracts, hasContracts, isContract });
      }
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, [mountedRef]);

  return state;
}
