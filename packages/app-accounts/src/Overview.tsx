// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React, { useState } from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/react-api';
import { Button, CardGrid } from '@polkadot/react-components';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import QrModal from './modals/Qr';
import Account from './Account';
import Banner from './Banner';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
  accounts?: SubjectInfo[];
}

function Overview ({ accounts = [], onStatusChange, t }: Props): React.ReactElement<Props> {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const emptyScreen = !(isCreateOpen || isImportOpen || isQrOpen) && (Object.keys(accounts).length === 0);

  const _toggleCreate = (): void => setIsCreateOpen(!isCreateOpen);
  const _toggleImport = (): void => setIsImportOpen(!isImportOpen);
  const _toggleQr = (): void => setIsQrOpen(!isQrOpen);

  return (
    <CardGrid
      banner={<Banner />}
      buttons={
        <Button.Group>
          <Button
            isPrimary
            label={t('Add account')}
            onClick={_toggleCreate}
          />
          <Button.Or />
          <Button
            isPrimary
            label={t('Restore JSON')}
            onClick={_toggleImport}
          />
          <Button.Or />
          <Button
            isPrimary
            label={t('Add via Qr')}
            onClick={_toggleQr}
          />
        </Button.Group>
      }
      isEmpty={emptyScreen}
      emptyText={t('No account yet?')}
    >
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
      {Object.keys(accounts).map((address): React.ReactNode => (
        <Account
          address={address}
          key={address}
        />
      ))}
    </CardGrid>
  );
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, { propName: 'accounts' })
);
