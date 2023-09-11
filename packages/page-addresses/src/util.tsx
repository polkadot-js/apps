// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { SortedAccount } from './types.js';

import { resolveDomainToAddress } from '@azns/resolver-core';
import React from 'react';

import { Menu } from '@polkadot/react-components';
import { systemNameToChainId } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { hexToU8a } from '@polkadot/util';
import { ethereumEncode } from '@polkadot/util-crypto';

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

export function getValidatedAddress (address: string, isEthereum: boolean): string | undefined {
  try {
    if (isEthereum) {
      const rawAddress = hexToU8a(address);

      return ethereumEncode(rawAddress);
    }

    const publicKey = keyring.decodeAddress(address);

    return keyring.encodeAddress(publicKey);
  } catch {
    return undefined;
  }
}

export async function getAddressFromDomain (domain: string, { api, systemChain }: {api: ApiPromise, systemChain: string}): Promise<string | null | undefined> {
  const chainId = systemNameToChainId.get(systemChain);

  if (!chainId) {
    return;
  }

  try {
    return (await resolveDomainToAddress(domain, { chainId, customApi: api })).address;
  } catch {
    return undefined;
  }
}
