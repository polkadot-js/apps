// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { Addresses } from './types';

import React, { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';

interface Props {
  children?: React.ReactNode;
}

const EMPTY: Addresses = { allAddresses: [], hasAddresses: false, isAddress: () => false };

export const AddressesCtx = React.createContext<Addresses>(EMPTY);

function extractAddresses (addresses: SubjectInfo = {}): Addresses {
  const allAddresses = Object.keys(addresses);
  const hasAddresses = allAddresses.length !== 0;
  const isAddress = (address: string): boolean => allAddresses.includes(address.toString());

  return { allAddresses, hasAddresses, isAddress };
}

export function AddressesCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const [addresses, setAddresses] = useState<Addresses>(EMPTY);

  // No unsub, global context - destroyed on app close
  useEffect((): void => {
    keyring.addresses.subject.subscribe((addresses) =>
      setAddresses(extractAddresses(addresses))
    );
  }, []);

  return (
    <AddressesCtx.Provider value={addresses}>
      {children}
    </AddressesCtx.Provider>
  );
}
