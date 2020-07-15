// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SortedAccount } from './types';

import React from 'react';
import { Menu } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

export function createMenuGroup (items: (React.ReactNode | false | undefined | null)[]): React.ReactNode | null {
  const filtered = items.filter((item): item is React.ReactNode => !!item);

  return filtered.length
    ? <>{filtered}<Menu.Divider /></>
    : null;
}

function expandList (mapped: SortedAccount[], entry: SortedAccount): SortedAccount[] {
  mapped.push(entry);

  entry.children.forEach((entry): void => {
    expandList(mapped, entry);
  });

  return mapped;
}

export function sortAccounts (addresses: string[], favorites: string[]): SortedAccount[] {
  const mapped = addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map((account): SortedAccount => ({
      account,
      children: [],
      isFavorite: favorites.includes(account.address)
    }))
    .sort((a, b) => (a.account.meta.whenCreated || 0) - (b.account.meta.whenCreated || 0));

  return mapped
    .filter((entry): boolean => {
      const parentAddress = entry.account.meta.parentAddress;

      if (parentAddress) {
        const parent = mapped.find(({ account: { address } }) => address === parentAddress);

        if (parent) {
          parent.children.push(entry);

          return false;
        }
      }

      return true;
    })
    .reduce(expandList, [])
    .sort((a, b): number =>
      a.isFavorite === b.isFavorite
        ? 0
        : b.isFavorite
          ? 1
          : -1
    );
}
