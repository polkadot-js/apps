// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { ComponentProps as Props } from '../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger, isLedger } from '@polkadot/react-api';
import { useAccounts, useFavorites, useToggle } from '@polkadot/react-hooks';
import { Button, Input, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './Account';
import Banner from './Banner';

type SortedAccount = { address: string; isFavorite: boolean };

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

function Overview ({ className, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [isCreateOpen, toggleCreate] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();
  const [isQrOpen, toggleQr] = useToggle();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect((): void => {
    setSortedAccounts(
      allAccounts
        .map((address): SortedAccount => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number => {
          const accA = keyring.getAccount(a.address) as KeyringAddress;
          const accB = keyring.getAccount(b.address) as KeyringAddress;

          return (accA.meta.whenCreated || 0) - (accB.meta.whenCreated || 0);
        })
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
  }, [allAccounts, favorites]);

  return (
    <div className={className}>
      <Banner />
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
      {isQrOpen && (
        <QrModal
          onClose={toggleQr}
          onStatusChange={onStatusChange}
        />
      )}
      <Button.Group>
        <Button
          icon='add'
          label={t('Add account')}
          onClick={toggleCreate}
        />
        <Button.Or />
        <Button
          icon='sync'
          label={t('Restore JSON')}
          onClick={toggleImport}
        />
        <Button.Or />
        <Button
          icon='qrcode'
          label={t('Add via Qr')}
          onClick={toggleQr}
        />
        {isLedger() && (
          <>
            <Button.Or />
            <Button
              icon='question'
              label={t('Query Ledger')}
              onClick={queryLedger}
            />
          </>
        )}
      </Button.Group>
      <Table>
        <Table.Head filter={
          <div className='filter--tags'>
            <Input
              autoFocus
              isFull
              label={t('filter by name or tags')}
              onChange={setFilter}
              value={filter}
            />
          </div>
        }>
          <th className='start' colSpan={3}><h1>{t('accounts')}</h1></th>
          <th>{t('type')}</th>
          <th className='start'>{t('tags')}</th>
          <th>{t('transactions')}</th>
          <th>{t('balances')}</th>
          <th colSpan={2}>&nbsp;</th>
        </Table.Head>
        <Table.Body empty={t('no accounts yet, create or import an existing')}>
          {sortedAccounts.map(({ address, isFavorite }): React.ReactNode => (
            <Account
              address={address}
              filter={filter}
              isFavorite={isFavorite}
              key={address}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </Table.Body>
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
