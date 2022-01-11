// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { DisplayedJudgement } from '@polkadot/react-components/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import type { AccountBalance, SortedAccount } from './types';

import FileSaver from 'file-saver';
import React from 'react';

import { getEnvironment } from '@polkadot/react-api/util';
import { InputAddress, Menu } from '@polkadot/react-components';
import { getAccountCryptoType, getAddressMeta } from '@polkadot/react-components/util';
import { BN_ZERO } from '@polkadot/util';

export function createMenuGroup (key: string, items: (React.ReactNode | false | undefined | null)[], header?: string): React.ReactNode | null {
  const filtered = items.filter((item): item is React.ReactNode => !!item);

  return filtered.length
    ? <React.Fragment key={key}>
      <Menu.Divider />
      {header ? <Menu.Header>{header}</Menu.Header> : null}
      {filtered}
    </React.Fragment>
    : null;
}

export type AccountIdIsh = AccountId | AccountIndex | Address | string | Uint8Array | null;

export function downloadAccount ({ json, pair }: CreateResult): void {
  FileSaver.saveAs(
    new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' }),
    `${pair.address}.json`
  );
}

export function tryCreateAccount (commitAccount: () => CreateResult, success: string): ActionStatus {
  const status: ActionStatus = {
    action: 'create',
    message: success,
    status: 'success'
  };

  try {
    const result = commitAccount();
    const address = result.pair.address;

    status.account = address;

    if (getEnvironment() === 'web') {
      downloadAccount(result);
    }

    downloadAccount(result);
    InputAddress.setLastValue('account', address);
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

export const sortCategory = ['parent', 'name', 'date', 'balances', 'type'] as const;
export type SortCategory = typeof sortCategory[number];

const comparator = (accounts: Record<string, SortedAccount | undefined>, balances: Record<string, AccountBalance | undefined>, category: SortCategory, fromMax: boolean) => {
  function accountQualifiedName (account: SortedAccount | undefined): string {
    if (account) {
      const parent = (account.account?.meta.parentAddress || '') as string;

      return accountQualifiedName(accounts[parent]) + account.address;
    } else {
      return '';
    }
  }

  function make <T> (getValue: (acc: SortedAccount) => T, compare: (a: T, b: T) => number) {
    const mult = fromMax ? 1 : -1;

    return (a: SortedAccount, b: SortedAccount) =>
      mult * compare(getValue(a), getValue(b));
  }

  switch (category) {
    case 'parent':
      // We need to ensure that parent will be adjacent to its children
      // so we use format '...<grand-parent-addr><parent-addr><account-addr>'
      return make(accountQualifiedName, (a, b) => a.localeCompare(b));

    case 'name':
      return make((acc) => getAddressMeta(acc.address).name ?? '', (a, b) => a.localeCompare(b));

    case 'date':
      return make((acc) => acc.account?.meta.whenCreated ?? 0, (a, b) => a - b);

    case 'balances':
      return make((acc) => balances[acc.address]?.total ?? BN_ZERO, (a, b) => a.cmp(b));

    case 'type':
      return make((acc) => getAccountCryptoType(acc.address), (a, b) => a.localeCompare(b));
  }
};

export function sortAccounts (accountsList: SortedAccount[], accountsMap: Record<string, SortedAccount>, balances: Record<string, AccountBalance>, by: SortCategory, fromMax: boolean): SortedAccount[] {
  return [...accountsList]
    .sort(comparator(accountsMap, balances, by, fromMax))
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : b.isFavorite
          ? 1
          : -1);
}

export const getJudgementColor = (name: DisplayedJudgement): 'green' | 'red' => {
  return (name === 'Erroneous' || name === 'Low quality') ? 'red' : 'green';
};
