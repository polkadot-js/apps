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
import Account from './Account';
import Banner from './Banner';
import translate from './translate';

interface Props extends ComponentProps, I18nProps {
  accounts?: SubjectInfo[];
}

interface State {
  isCreateOpen: boolean;
  isImportOpen: boolean;
}

class Overview extends React.PureComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const { state: { isCreateOpen = false } = {} } = this.props.location;

    this.state = {
      isCreateOpen,
      isImportOpen: false
    };
  }

  public render (): React.ReactNode {
    const { accounts, t } = this.props;
    const { isCreateOpen, isImportOpen } = this.state;
    const emptyScreen = !isCreateOpen && !isImportOpen && (!accounts || Object.keys(accounts).length === 0);

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
          </Button.Group>
        }
        isEmpty={emptyScreen}
        emptyText={t('No account yet?')}
      >
        {this.renderCreate()}
        {this.renderImport()}
        {accounts && Object.keys(accounts).map((address): React.ReactNode => (
          <Account
            address={address}
            key={address}
          />
        ))}
      </CardGrid>
    );
  }

  private renderCreate (): React.ReactNode {
    const { isCreateOpen } = this.state;
    const { onStatusChange } = this.props;

    if (!isCreateOpen) {
      return null;
    }

    return (
      <CreateModal
        onClose={this.toggleCreate}
        onStatusChange={onStatusChange}
      />
    );
  }

  private renderImport (): React.ReactNode {
    const { isImportOpen } = this.state;
    const { onStatusChange } = this.props;

    if (!isImportOpen) {
      return null;
    }

    return (
      <ImportModal
        onClose={this.toggleImport}
        onStatusChange={onStatusChange}
      />
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
}

export default withMulti(
  Overview,
  translate,
  withObservable(accountObservable.subject, { propName: 'accounts' })
);
