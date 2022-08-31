// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { nextTick } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useIsMountedRef } from './useIsMountedRef';

interface UseAddresses {
  allAddresses: string[];
  hasAddresses: boolean;
  isAddress: (address: string) => boolean;
}

function useAddressesImpl (): UseAddresses {
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<UseAddresses>({ allAddresses: [], hasAddresses: false, isAddress: () => false });

  useEffect((): () => void => {
    const subscription = keyring.addresses.subject.subscribe((addresses): void => {
      if (mountedRef.current) {
        const allAddresses = addresses ? Object.keys(addresses) : [];
        const hasAddresses = allAddresses.length !== 0;
        const isAddress = (address: string): boolean => allAddresses.includes(address.toString());

        setState({ allAddresses, hasAddresses, isAddress });
      }
    });

    return (): void => {
      nextTick(() => subscription.unsubscribe());
    };
  }, [mountedRef]);

  return state;
}

export const useAddresses = createNamedHook('useAddresses', useAddressesImpl);
