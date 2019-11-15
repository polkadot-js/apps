// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';

interface UseAccounts {
  allAddresses: string[];
  hasAddresses: boolean;
}

export default function useAccounts (): UseAccounts {
  const [state, setState] = useState<UseAccounts>({ allAddresses: [], hasAddresses: false });

  useEffect((): () => void => {
    const subscription = addressObservable.subject.subscribe((addresses): void => {
      const allAddresses = addresses ? Object.keys(addresses) : [];
      const hasAddresses = allAddresses.length !== 0;

      setState({ allAddresses, hasAddresses });
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
