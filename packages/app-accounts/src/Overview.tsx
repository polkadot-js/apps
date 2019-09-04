// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
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

interface State {
  isCreateOpen: boolean;
  isImportOpen: boolean;
  isQrOpen: boolean;
}

class Overview extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    this.state = {
      isCreateOpen: false,
      isImportOpen: false,
      isQrOpen: false
    };
  }

  public render (): React.ReactNode {
    const { accounts = [], onStatusChange, t } = this.props;
    const { isCreateOpen, isImportOpen, isQrOpen } = this.state;
    const emptyScreen = !(isCreateOpen || isImportOpen || isQrOpen) && (Object.keys(accounts).length === 0);

    return (
      <CardGrid
        banner={<Banner />}
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
            <Button.Or />
            <Button
              isPrimary
              label={t('Add via Qr')}
              onClick={this.toggleQr}
            />
          </Button.Group>
        }
        isEmpty={emptyScreen}
        emptyText={t('No account yet?')}
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
        {isQrOpen && (
          <QrModal
            onClose={this.toggleQr}
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

  private toggleCreate = (): void => {
    this.setState(({ isCreateOpen }): Pick<State, never> => ({
      isCreateOpen: !isCreateOpen
    }));
  }

  private toggleImport = (): void => {
    this.setState(({ isImportOpen }): Pick<State, never> => ({
      isImportOpen: !isImportOpen
    }));
  }

  private toggleQr = (): void => {
    this.setState(({ isQrOpen }): Pick<State, never> => ({
      isQrOpen: !isQrOpen
    }));
  }
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, { propName: 'accounts' })
);
