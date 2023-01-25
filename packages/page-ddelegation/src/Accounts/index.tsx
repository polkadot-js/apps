// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { BN } from '@polkadot/util';
import type { AccountBalance, Delegation, SortedAccount } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useAccounts, useApi, useDelegations, useFavorites, useIpfs, useLedger, useLoadingDelay, useProxies, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sortAccounts, SortCategory, sortCategory } from '../util';
import Account from './Account';

interface Balances {
  accounts: Record<string, AccountBalance>;
  summary?: AccountBalance;
}

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

interface SortControls {
  sortBy: SortCategory;
  sortFromMax: boolean;
}

const DEFAULT_SORT_CONTROLS: SortControls = { sortBy: 'date', sortFromMax: true };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();

  const [ddelegation, setdelegation] = useState<Delegation | undefined>(undefined);

  const [isCreateOpen, toggleCreate, setIsCreateOpen] = useToggle();

  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [balances, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [sortedAccounts, setSorted] = useState<SortedAccount[]>([]);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortControls>(DEFAULT_SORT_CONTROLS);
  const delegations = useDelegations();
  const proxies = useProxies();
  const isLoading = useLoadingDelay();

  const favoritesMap = useMemo(
    () => Object.fromEntries(favorites.map((x) => [x, true])),
    [favorites]
  );

  // detect multisigs
  const hasPalletMultisig = useMemo(
    () => isFunction((api.tx.multisig || api.tx.utility)?.approveAsMulti),
    [api]
  );

  // proxy support
  const hasPalletProxy = useMemo(
    () => isFunction(api.tx.proxy?.addProxy),
    [api]
  );

  const accountsWithInfo = useMemo(
    () => allAccounts
      .map((address, index): SortedAccount => {
        const deleg = delegations && delegations[index]?.isDelegating && delegations[index]?.asDelegating;
        const delegation: Delegation | undefined = (deleg && {
          accountDelegated: deleg.target.toString(),
          amount: deleg.balance,
          conviction: deleg.conviction
        }) || undefined;

        return {
          account: keyring.getAccount(address),
          address,
          delegation,
          isFavorite: favoritesMap[address ?? ''] ?? false
        };
      }),
    [allAccounts, favoritesMap, delegations]
  );

  const accountsMap = useMemo(
    () => accountsWithInfo.reduce<Record<string, SortedAccount>>((ret, x) => {
      ret[x.address] = x;

      return ret;
    }, {}),
    [accountsWithInfo]
  );

  const header = useRef([
    [t('Your Representatives'), 'start', 3],
    // [t('type')],
    // [t('transactions'), 'media--1500'],
    // [t('balances'), 'balances'],
    []
  ]);

  useEffect((): void => {
    // We add new accounts to the end
    setSorted((sortedAccounts) =>
      [...sortedAccounts.map((x) => accountsWithInfo.find((y) => x.address === y.address)).filter((x): x is SortedAccount => !!x),
        ...accountsWithInfo.filter((x) => !sortedAccounts.find((y) => x.address === y.address))]);
  }, [accountsWithInfo]);

  const accounts = balances.accounts;

  useEffect((): void => {
    setSorted((sortedAccounts) =>
      sortAccounts(sortedAccounts, accountsMap, accounts, sortBy, sortFromMax));
  }, [accountsWithInfo, accountsMap, accounts, sortBy, sortFromMax]);

  const _setBalance = useCallback(
    (account: string, balance: AccountBalance) =>
      setBalances(({ accounts }: Balances): Balances => {
        accounts[account] = balance;

        const aggregate = (key: keyof AccountBalance) =>
          Object.values(accounts).reduce((total: BN, value: AccountBalance) => total.add(value[key]), BN_ZERO);

        return {
          accounts,
          summary: {
            bonded: aggregate('bonded'),
            locked: aggregate('locked'),
            redeemable: aggregate('redeemable'),
            total: aggregate('total'),
            transferrable: aggregate('transferrable'),
            unbonding: aggregate('unbonding')
          }
        };
      }),
    []
  );

  const _openCreateModal = useCallback(() => setIsCreateOpen(true), [setIsCreateOpen]);

  const accountComponents = useMemo(() => {
    const ret: Record<string, React.ReactNode> = {};

    accountsWithInfo.forEach(({ account, address, delegation, isFavorite }, index) => {
      // setdelegation(delegation);
      if (delegation !== undefined) {
        setdelegation(delegation);
      }

      console.log(delegation, 'delegation!!!!!!!!!!!!!');
      ret[address] =
        <Account
          account={account}
          delegation={delegation}
          filter={filterOn}
          isFavorite={isFavorite}
          key={`${index}:${address}`}
          proxy={proxies?.[index]}
          setBalance={_setBalance}
          toggleFavorite={toggleFavorite}
        />;
    });

    return ret;
  }, [accountsWithInfo, filterOn, proxies, _setBalance, toggleFavorite]);

  const onDropdownChange = () => (item: SortCategory) => setSortBy({ sortBy: item, sortFromMax });

  const dropdownOptions = () => sortCategory.map((x) => ({ text: x, value: x }));

  console.log(ddelegation, 'PLEASE!!!');

  const onSortDirectionChange = () => () => setSortBy({ sortBy, sortFromMax: !sortFromMax });

  // console.log(sortedAccounts.length,"sortedAccounts")
  // console.log(delegations !== undefined ? delegations : 0,"delegations")
  console.log(ddelegation, 'delegations');

  return (
    <div className={className}>
      {ddelegation === undefined
        ? null
        : <Table
          className='table'
          empty={ddelegation === undefined && t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
          header={header.current}
          withCollapsibleRows
        >
          {!isLoading &&
      sortedAccounts.map(({ address }) => accountComponents[address])
          }
        </Table>}
    </div>
  );
}

export default React.memo(styled(Overview)`
  .ui--Dropdown {
    width: 15rem;
  }

  .table {
    width: 20rem;
    padding-left: 50px;
  }

  .dropdown-section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`);
