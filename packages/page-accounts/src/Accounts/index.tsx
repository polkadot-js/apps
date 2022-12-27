// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { BN } from '@polkadot/util';
import type { AccountBalance, Delegation, SortedAccount } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterInput, SortDropdown, SummaryBox, Table } from '@polkadot/react-components';
import { getAccountCryptoType } from '@polkadot/react-components/util';
import { useAccounts, useApi, useDelegations, useFavorites, useIpfs, useLedger, useLoadingDelay, useProxies, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, isFunction } from '@polkadot/util';

import CreateModal from '../modals/Create';
import ImportModal from '../modals/Import';
import Ledger from '../modals/Ledger';
import Multisig from '../modals/MultisigCreate';
import Proxy from '../modals/ProxiedAdd';
import Qr from '../modals/Qr';
import { useTranslation } from '../translate';
import { sortAccounts, SortCategory, sortCategory } from '../util';
import Account from './Account';
import BannerClaims from './BannerClaims';
import BannerExtension from './BannerExtension';
import Summary from './Summary';

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

type GroupName = 'accounts' | 'hardware' | 'injected' | 'multisig' | 'proxied' | 'qr' | 'testing';

const DEFAULT_SORT_CONTROLS: SortControls = { sortBy: 'date', sortFromMax: true };

const STORE_FAVS = 'accounts:favorites';

const GROUP_ORDER: GroupName[] = ['accounts', 'injected', 'qr', 'hardware', 'proxied', 'multisig', 'testing'];

function groupAccounts (accounts: SortedAccount[]): Record<GroupName, string[]> {
  const ret: Record<GroupName, string[]> = {
    accounts: [],
    hardware: [],
    injected: [],
    multisig: [],
    proxied: [],
    qr: [],
    testing: []
  };

  for (let i = 0; i < accounts.length; i++) {
    const { account, address } = accounts[i];
    const cryptoType = getAccountCryptoType(address);

    if (account?.meta.isHardware) {
      ret.hardware.push(address);
    } else if (account?.meta.isTesting) {
      ret.testing.push(address);
    } else if (cryptoType === 'injected') {
      ret.injected.push(address);
    } else if (cryptoType === 'multisig') {
      ret.multisig.push(address);
    } else if (cryptoType === 'proxied') {
      ret.proxied.push(address);
    } else if (cryptoType === 'qr') {
      ret.qr.push(address);
    } else {
      ret.accounts.push(address);
    }
  }

  return ret;
}

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const { isLedgerEnabled } = useLedger();
  const [isCreateOpen, toggleCreate, setIsCreateOpen] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();
  const [isLedgerOpen, toggleLedger] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isProxyOpen, toggleProxy] = useToggle();
  const [isQrOpen, toggleQr] = useToggle();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [balances, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [sortedAccounts, setSorted] = useState<SortedAccount[]>([]);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortControls>(DEFAULT_SORT_CONTROLS);
  const delegations = useDelegations();
  const proxies = useProxies();
  const isLoading = useLoadingDelay();

  // We use favorites only to check if it includes some element,
  // so Object is better than array for that because hashmap access is O(1).
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

  const header = useMemo(
    (): Record<GroupName, [React.ReactNode?, string?, number?, (() => void)?][]> => {
      const ret: Record<GroupName, [React.ReactNode?, string?, number?, (() => void)?][]> = {
        accounts: [[t('accounts')]],
        hardware: [[t('hardware')]],
        injected: [[t('extension')]],
        multisig: [[t('multisig')]],
        proxied: [[t('proxied')]],
        qr: [[t('via qr')]],
        testing: [[t('development')]]
      };

      Object.values(ret).forEach((a): void => {
        a[0][1] = 'start';
        a[0][2] = 2;

        a.push(
          [undefined, 'balances'],
          []
        );
      });

      return ret;
    },
    [t]
  );

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

  const grouped = useMemo(
    () => groupAccounts(sortedAccounts),
    [sortedAccounts]
  );

  const accountComponents = useMemo(() => {
    const ret: Record<string, React.ReactNode> = {};

    accountsWithInfo.forEach(({ account, address, delegation, isFavorite }, index) => {
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

  const onSortDirectionChange = () => () => setSortBy({ sortBy, sortFromMax: !sortFromMax });

  return (
    <div className={className}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {isImportOpen && (
        <ImportModal
          onClose={toggleImport}
          onStatusChange={onStatusChange}
        />
      )}
      {isLedgerOpen && (
        <Ledger onClose={toggleLedger} />
      )}
      {isMultisigOpen && (
        <Multisig
          onClose={toggleMultisig}
          onStatusChange={onStatusChange}
        />
      )}
      {isProxyOpen && (
        <Proxy
          onClose={toggleProxy}
          onStatusChange={onStatusChange}
        />
      )}
      {isQrOpen && (
        <Qr
          onClose={toggleQr}
          onStatusChange={onStatusChange}
        />
      )}
      <BannerExtension />
      <BannerClaims />
      <Summary balance={balances.summary} />
      <SummaryBox>
        <section
          className='dropdown-section'
          data-testid='sort-by-section'
        >
          <SortDropdown
            defaultValue={sortBy}
            label={t<string>('sort by')}
            onChange={onDropdownChange()}
            onClick={onSortDirectionChange()}
            options={dropdownOptions()}
            sortDirection={sortFromMax ? 'ascending' : 'descending'}
          />
          <FilterInput
            filterOn={filterOn}
            label={t<string>('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='plus'
            isDisabled={isIpfs}
            label={t<string>('Add account')}
            onClick={_openCreateModal}
          />
          <Button
            icon='sync'
            isDisabled={isIpfs}
            label={t<string>('Restore JSON')}
            onClick={toggleImport}
          />
          <Button
            icon='qrcode'
            label={t<string>('Add via Qr')}
            onClick={toggleQr}
          />
          {isLedgerEnabled && (
            <>
              <Button
                icon='project-diagram'
                label={t<string>('Add via Ledger')}
                onClick={toggleLedger}
              />
            </>
          )}
          <Button
            icon='plus'
            isDisabled={!hasPalletMultisig || !hasAccounts}
            label={t<string>('Multisig')}
            onClick={toggleMultisig}
          />
          <Button
            icon='plus'
            isDisabled={!hasPalletProxy || !hasAccounts}
            label={t<string>('Proxied')}
            onClick={toggleProxy}
          />
        </Button.Group>
      </SummaryBox>
      {isLoading || !sortedAccounts.length
        ? (
          <Table
            empty={!isLoading && sortedAccounts && t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
            header={header.accounts}
            withCollapsibleRows
          />
        )
        : GROUP_ORDER.map((key) =>
          grouped[key].length
            ? (
              <Table
                empty={t<string>('No accounts')}
                header={header[key]}
                key={key}
                withCollapsibleRows
              >
                {grouped[key].map((a) => accountComponents[a])}
              </Table>
            )
            : null
        )
      }
    </div>
  );
}

export default React.memo(styled(Overview)`
  .ui--Dropdown {
    width: 15rem;
  }

  .dropdown-section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`);
