// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { CreateResult, KeyringAddress } from '@polkadot/ui-keyring/types';
import type { SortedAccount } from './types';

import FileSaver from 'file-saver';
import React from 'react';

import { getEnvironment } from '@polkadot/react-api/util';
import { InputAddress, Menu } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

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
