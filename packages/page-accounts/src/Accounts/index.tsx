// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { Voting } from '@polkadot/types/interfaces';
import { Delegation, SortedAccount } from '../types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger, isLedger } from '@polkadot/react-api';
import { useApi, useAccounts, useCall, useFavorites, useIpfs, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Button, Input, Table } from '@polkadot/react-components';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';
import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import Multisig from './modals/MultisigCreate';
import Proxy from './modals/ProxyAdd';
import Qr from './modals/Qr';
import Account from './Account';
import BannerClaims from './BannerClaims';
import BannerExtension from './BannerExtension';
import { sortAccounts } from '../util';

interface Balances {
  accounts: Record<string, BN>;
  balanceTotal?: BN;
}

interface Sorted {
  sortedAccounts: SortedAccount[];
  sortedAddresses: string[];
}

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

const STORE_FAVS = 'accounts:favorites';

// query the ledger for the address, adding it to the keyring
async function queryLedger (): Promise<void> {
  const ledger = getLedger();

  try {
    const { address } = await ledger.getAddress();

    keyring.addHardware(address, 'ledger', { name: 'ledger' });
  } catch (error) {
    console.error(error);
  }
}

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { isIpfs } = useIpfs();
  const [isCreateOpen, toggleCreate] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isProxyOpen, toggleProxy] = useToggle();
  const [isQrOpen, toggleQr] = useToggle();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [{ balanceTotal }, setBalances] = useState<Balances>({ accounts: {} });
  const [filterOn, setFilter] = useState<string>('');
  const [sortedAccountsWithDelegation, setSortedAccountsWithDelegation] = useState<SortedAccount[]>([]);
  const [{ sortedAccounts, sortedAddresses }, setSorted] = useState<Sorted>({ sortedAccounts: [], sortedAddresses: [] });
  const delegations = useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [sortedAddresses]);

  useEffect((): void => {
    const sortedAccounts = sortAccounts(allAccounts, favorites);
    const sortedAddresses = sortedAccounts.map((a) => a.account.address);

    setSorted({ sortedAccounts, sortedAddresses });
  }, [allAccounts, favorites]);

  useEffect(() => {
    if (api.query.democracy?.votingOf && !delegations?.length) {
      return;
    }

    setSortedAccountsWithDelegation(
      sortedAccounts?.map((account, index) => {
        let delegation: Delegation | undefined;

        if (delegations && delegations[index]?.isDelegating) {
          const { balance: amount, conviction, target } = delegations[index].asDelegating;

          delegation = {
            accountDelegated: target.toString(),
            amount,
            conviction
          };
        }

        return ({
          ...account,
          delegation
        });
      })
    );
  }, [api, delegations, sortedAccounts]);

  const _setBalance = useCallback(
    (account: string, balance: BN) =>
      setBalances(({ accounts }: Balances): Balances => {
        accounts[account] = balance;

        return {
          accounts,
          balanceTotal: Object.values(accounts).reduce((total: BN, value: BN) => total.add(value), BN_ZERO)
        };
      }),
    []
  );

  const header = useMemo(() => [
    [t('accounts'), 'start', 3],
    [t('parent'), 'address ui--media-1400'],
    [t('type')],
    [t('tags'), 'start'],
    [t('transactions'), 'ui--media-1500'],
    [t('balances')],
    [],
    [undefined, 'mini ui--media-1400']
  ], [t]);

  const footer = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='ui--media-1400' />
      <td colSpan={2} />
      <td className='ui--media-1500' />
      <td className='number'>
        {balanceTotal && <FormatBalance value={balanceTotal} />}
      </td>
      <td />
      <td className='ui--media-1400' />
    </tr>
  ), [balanceTotal]);

  const filter = useMemo(() => (
    <div className='filter--tags'>
      <Input
        autoFocus
        isFull
        label={t<string>('filter by name or tags')}
        onChange={setFilter}
        value={filterOn}
      />
    </div>
  ), [filterOn, t]);

  return (
    <div className={className}>
      <BannerExtension />
      <BannerClaims />
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
      <Button.Group>
        <Button
          icon='plus'
          isDisabled={isIpfs}
          label={t<string>('Add account')}
          onClick={toggleCreate}
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
        {isLedger() && (
          <>
            <Button
              icon='question'
              label={t<string>('Query Ledger')}
              onClick={queryLedger}
            />
          </>
        )}
        <Button
          icon='plus'
          isDisabled={!(api.tx.multisig || api.tx.utility)}
          label={t<string>('Multisig')}
          onClick={toggleMultisig}
        />
        <Button
          icon='plus'
          isDisabled={!api.tx.proxy}
          label={t<string>('Proxied')}
          onClick={toggleProxy}
        />
      </Button.Group>
      <Table
        empty={t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
        filter={filter}
        footer={footer}
        header={header}
      >
        {sortedAccountsWithDelegation.map(({ account, delegation, isFavorite }): React.ReactNode => (
          <Account
            account={account}
            delegation={delegation}
            filter={filterOn}
            isFavorite={isFavorite}
            key={account.address}
            setBalance={_setBalance}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .filter--tags {
    .ui--Dropdown {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
