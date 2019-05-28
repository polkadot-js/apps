// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';
import { Button, CardGrid } from '@polkadot/ui-app';

import CreateModal from './modals/Create';
import ImportModal from './modals/Import';
import Account from './Account';
import translate from './translate';

type Props = ComponentProps & I18nProps & {
  accounts?: SubjectInfo[]
};

type State = {
  isCreateOpen: boolean,
  isImportOpen: boolean
};

class Overview extends React.PureComponent<Props, State> {
  state: State = {
    isCreateOpen: false,
    isImportOpen: false
  };

  render () {
    const { accounts, onStatusChange, t } = this.props;
    const { isCreateOpen, isImportOpen } = this.state;

    return (
      <CardGrid
        buttons={
          <Button.Group>
            <Button
              isPrimary
              label={t('Add account')}
              onClick={this.toggleCreate}
            />
            <Button.Or />
            <Button
              isPrimary
              label={t('Restore JSON')}
              onClick={this.toggleImport}
            />
          </Button.Group>
        }
      >
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        {isImportOpen && (
          <ImportModal
            onClose={this.toggleImport}
            onStatusChange={onStatusChange}
          />
        )}
        {accounts && Object.keys(accounts).map((address) => (
          <Account
            address={address}
            key={address}
          />
        ))}
      </CardGrid>
    );
  }

  private toggleCreate = (): void => {
    this.setState(({ isCreateOpen }) => ({
      isCreateOpen: !isCreateOpen
    }));
  }

  private toggleImport = (): void => {
    this.setState(({ isImportOpen }) => ({
      isImportOpen: !isImportOpen
    }));
  }
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, { propName: 'accounts' })
);
