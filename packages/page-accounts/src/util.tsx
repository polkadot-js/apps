// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { AccountBalance, SortedAccount } from './types';

import React from 'react';

import { Menu } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import stableSort from './stableSort';

export function createMenuGroup (key: string, items: (React.ReactNode | false | undefined | null)[]): React.ReactNode | null {
  const filtered = items.filter((item): item is React.ReactNode => !!item);

  return filtered.length
    ? <React.Fragment key={key}><Menu.Divider />{filtered}</React.Fragment>
    : null;
}

function expandList (mapped: SortedAccount[], entry: SortedAccount): SortedAccount[] {
  mapped.push(entry);

  entry.children.forEach((entry): void => {
    expandList(mapped, entry);
  });

  return mapped;
}

export type AccountIdIsh = AccountId | AccountIndex | Address | string | Uint8Array | null;

export function GetAccountCryptoType (accountId: AccountIdIsh): string {
  try {
    const current = accountId
      ? keyring.getPair(accountId.toString())
      : null;

    if (current) {
      return current.meta.isInjected
        ? 'injected'
        : current.meta.isHardware
          ? current.meta.hardwareType as string || 'hardware'
          : current.meta.isExternal
            ? current.meta.isMultisig
              ? 'multisig'
              : current.meta.isProxied
                ? 'proxied'
                : 'external'
            : current.type;
    }
  } catch {
    // cannot determine, keep unknown
  }

  return 'unknown';
}

export type SortCategory = 'date' | 'balances' | 'type';

const comparator = (balances: Record<string, AccountBalance>, category: SortCategory, fromMax: boolean) => {
  const mult = fromMax ? 1 : -1;

  switch (category) {
    case 'date':
      return (a: SortedAccount, b: SortedAccount) =>
        mult * ((a.account.meta.whenCreated ?? 0) - (b.account.meta.whenCreated ?? 0));

    case 'balances':
      return (a: SortedAccount, b: SortedAccount) => {
        const x = balances[a.account.address]?.total;
        const y = balances[b.account.address]?.total;

        return mult * x?.cmp(y);
      };

    case 'type':
      return (a: SortedAccount, b: SortedAccount) => {
        return mult *
          GetAccountCryptoType(a.account.address).localeCompare(GetAccountCryptoType(b.account.address));
      };
  }
};

export function sortAccounts (addresses: string[], balances: Record<string, AccountBalance>, favorites: Record<string, boolean>, by: SortCategory, fromMax: boolean): SortedAccount[] {
  const mapped = addresses
    .map((address) => keyring.getAccount(address))
    .filter((account): account is KeyringAddress => !!account)
    .map((account): SortedAccount => ({
      account,
      children: [],
      isFavorite: favorites[account.address] ?? false
    }));

  const sorted = stableSort(mapped, comparator(balances, by, fromMax));

  const filtered = sorted
    .filter((entry): boolean => {
      const parentAddress = entry.account.meta.parentAddress;

      if (parentAddress) {
        const parent = sorted.find(({ account: { address } }) => address === parentAddress);

        if (parent) {
          parent.children.push(entry);

          return false;
        }
      }

      return true;
    })
    .reduce(expandList, []);

  return stableSort(filtered,
    (a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : b.isFavorite
          ? 1
          : -1);
}
