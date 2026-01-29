// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { Accounts, Addresses } from './types.js';

import React, { useEffect, useState } from 'react';
import { combineLatest, map } from 'rxjs';

import { keyring } from '@polkadot/ui-keyring';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { useApi } from '../useApi.js';

interface Props {
  children?: React.ReactNode;
}

interface State {
  accounts: Accounts;
  addresses: Addresses;
}

const EMPTY_IS = () => false;

const EMPTY: State = {
  accounts: { allAccounts: [], allAccountsHex: [], areAccountsLoaded: false, hasAccounts: false, isAccount: EMPTY_IS },
  addresses: { allAddresses: [], allAddressesHex: [], areAddressesLoaded: false, hasAddresses: false, isAddress: EMPTY_IS }
};

export const KeyringCtx = React.createContext<State>(EMPTY);

/**
 * @internal Helper function to dedupe a list of items, only adding it if
 *
 *   1. It is not already present in our list of results
 *   2. It does not exist against a secondary list to check
 *
 * The first check ensures that we never have dupes in the original. The second
 * ensures that e.g. an address is not also available as an account
 **/
function filter (isEthereum: boolean, items: string[], others: string[] = []): string[] {
  const allowedLength = isEthereum
    ? 20
    : 32;

  return items.reduce<string[]>((result, a) => {
    if (!result.includes(a) && !others.includes(a)) {
      try {
        if (decodeAddress(a).length >= allowedLength) {
          result.push(a);
        } else {
          console.warn(`Not adding address ${a}, not in correct format for chain (requires publickey from address)`);
        }
      } catch {
        console.error(a, allowedLength);
      }
    }

    return result;
  }, []);
}

/**
 * @internal Helper function to convert a list of ss58 addresses into hex
 **/
function toHex (items: string[]): string[] {
  return items
    .map((a): string | null => {
      try {
        return u8aToHex(decodeAddress(a));
      } catch (error) {
        // This is actually just a failsafe - the keyring really should
        // not be passing through invalid ss58 values, but never say never
        console.error(`Unable to convert address ${a} to hex`, (error as Error).message);

        return null;
      }
    })
    .filter((a): a is string => !!a);
}

/**
 * @internal Helper to create an is{Account, Address} check
 **/
function createCheck (items: string[]): Accounts['isAccount'] {
  return (a?: string | null | { toString: () => string }): boolean =>
    !!a && items.includes(a.toString());
}

function extractAccounts (isEthereum: boolean, accounts: SubjectInfo = {}): Accounts {
  const allAccounts = filter(isEthereum, Object.keys(accounts));

  return {
    allAccounts,
    allAccountsHex: toHex(allAccounts),
    areAccountsLoaded: true,
    hasAccounts: allAccounts.length !== 0,
    isAccount: createCheck(allAccounts)
  };
}

function extractAddresses (isEthereum: boolean, addresses: SubjectInfo = {}, accounts: string[]): Addresses {
  const allAddresses = filter(isEthereum, Object.keys(addresses), accounts);

  return {
    allAddresses,
    allAddressesHex: toHex(allAddresses),
    areAddressesLoaded: true,
    hasAddresses: allAddresses.length !== 0,
    isAddress: createCheck(allAddresses)
  };
}

export function KeyringCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { isApiReady, isEthereum } = useApi();
  const [state, setState] = useState(EMPTY);

  useEffect((): () => void => {
    let sub: null | { unsubscribe: () => void } = null;

    // Defer keyring injection until the API is ready - we need to have the chain
    // info to determine which type of addresses we can use (before subscribing)
    if (isApiReady) {
      sub = combineLatest([
        keyring.accounts.subject.pipe(
          map((accInfo) => extractAccounts(isEthereum, accInfo))
        ),
        keyring.addresses.subject
      ])
        .pipe(
          map(([accounts, addrInfo]): State => ({
            accounts,
            addresses: extractAddresses(isEthereum, addrInfo, accounts.allAccounts)
          }))
        )
        .subscribe((state) => setState(state));
    }

    return (): void => {
      sub && sub.unsubscribe();
    };
  }, [isApiReady, isEthereum]);

  return (
    <KeyringCtx.Provider value={state}>
      {children}
    </KeyringCtx.Provider>
  );
}
