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
import Account from './Account';
import Banner from './Banner';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
  accounts?: SubjectInfo[];
}

function Overview ({ accounts, onStatusChange, t }: Props): React.ReactElement<Props> {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isImportOpen, setImportOpen] = useState(false);
  const emptyScreen = !isCreateOpen && !isImportOpen && (!accounts || Object.keys(accounts).length === 0);

  const toggleCreate = (): void => setCreateOpen(!isCreateOpen);
  const toggleImport = (): void => setImportOpen(!isImportOpen);

  return (
    <CardGrid
      banner={<Banner />}
      buttons={
        <Button.Group>
          <Button
            isPrimary
            label={t('Add account')}
            onClick={toggleCreate}
          />
          <Button.Or />
          <Button
            isPrimary
            label={t('Restore JSON')}
            onClick={toggleImport}
          />
        </Button.Group>
      }
      isEmpty={emptyScreen}
      emptyText={t('No account yet?')}
    >
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
      {accounts && Object.keys(accounts).map((address): React.ReactNode => (
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
