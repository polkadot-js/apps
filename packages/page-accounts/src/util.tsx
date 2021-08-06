// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
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

const expandList = (children: Record<string, SortedAccount[]>) =>
  (mapped: SortedAccount[], entry: SortedAccount): SortedAccount[] => {
    mapped.push(entry);

    children[entry.address]?.forEach((entry): void => {
      expandList(children)(mapped, entry);
    });

    return mapped;
  };

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
        mult * ((a.account?.meta.whenCreated ?? 0) - (b.account?.meta.whenCreated ?? 0));

    case 'balances':
      return (a: SortedAccount, b: SortedAccount) => {
        const x = balances[a.address ?? '']?.total;
        const y = balances[b.address ?? '']?.total;

        return mult * x?.cmp(y);
      };

    case 'type':
      return (a: SortedAccount, b: SortedAccount) => {
        return mult *
          GetAccountCryptoType(a.address ?? '').localeCompare(GetAccountCryptoType(b.address ?? ''));
      };
  }
};

export function sortAccounts (mapped: SortedAccount[], balances: Record<string, AccountBalance>, by: SortCategory, fromMax: boolean): SortedAccount[] {
  const sorted = stableSort(mapped, comparator(balances, by, fromMax));
  const children: Record<string, SortedAccount[]> = Object.fromEntries(mapped.map((x) => [x.address, []]));

  const filtered = sorted
    .filter((entry): boolean => {
      if (!entry.account) { return true; }

      const parentAddress = entry.account.meta.parentAddress;

      if (parentAddress) {
        const parent = sorted.find(({ address }) => address === parentAddress);

        if (parent) {
          children[parent.address]?.push(entry);

          return false;
        }
      }

      return true;
    })
    .reduce(expandList(children), []);

  return stableSort(filtered,
    (a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : b.isFavorite
          ? 1
          : -1);
}
