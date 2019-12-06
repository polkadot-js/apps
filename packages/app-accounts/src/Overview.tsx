// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { getLedger, isLedger } from '@polkadot/react-api';
import { useAccounts, useFavorites } from '@polkadot/react-hooks';
import { Button, InputTags, Table } from '@polkadot/react-components';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './Account';
import Banner from './Banner';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
}

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

function Overview ({ className, onStatusChange, t }: Props): React.ReactElement<Props> {
  const { allAccounts, hasAccounts } = useAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAccounts, setSortedAccounts] = useState<SortedAccount[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect((): void => {
    setSortedAccounts(
      allAccounts
        .map((address): SortedAccount => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
  }, [allAccounts, favorites]);

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);
  const _toggleImport = (): void => setIsImportOpen(!isImportOpen);
  const _toggleQr = (): void => setIsQrOpen(!isQrOpen);

  return (
    <div className={className}>
      <Banner />
      {isCreateOpen && (
        <CreateModal
          onClose={_toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {isImportOpen && (
        <ImportModal
          onClose={_toggleImport}
          onStatusChange={onStatusChange}
        />
      )}
      {isQrOpen && (
        <QrModal
          onClose={_toggleQr}
          onStatusChange={onStatusChange}
        />
      )}
      <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Add account')}
          onClick={_toggleCreate}
        />
        <Button.Or />
        <Button
          icon='sync'
          isPrimary
          label={t('Restore JSON')}
          onClick={_toggleImport}
        />
        <Button.Or />
        <Button
          icon='qrcode'
          isPrimary
          label={t('Add via Qr')}
          onClick={_toggleQr}
        />
        {isLedger() && (
          <>
            <Button.Or />
            <Button
              icon='question'
              isPrimary
              label={t('Query Ledger')}
              onClick={queryLedger}
            />
          </>
        )}
      </Button.Group>
      {hasAccounts
        ? (
          <>
            <div className='filter--tags'>
              <InputTags
                allowAdd={false}
                label={t('filter by tags')}
                onChange={setTags}
                defaultValue={tags}
                value={tags}
              />
            </div>
            <Table>
              <Table.Body>
                {sortedAccounts.map(({ address, isFavorite }): React.ReactNode => (
                  <Account
                    address={address}
                    allowTags={tags}
                    isFavorite={isFavorite}
                    key={address}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </Table.Body>
            </Table>
          </>
        )
        : t('no accounts yet, create or import and existing')
      }
    </div>
  );
}

export default translate(
  styled(Overview)`
    .filter--tags {
      .ui--Dropdown {
        padding-left: 0;

        label {
          left: 1.55rem;
        }
      }
    }
  `
);
