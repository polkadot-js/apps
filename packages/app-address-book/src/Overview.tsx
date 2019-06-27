// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { Button, CardGrid } from '@polkadot/ui-app';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { withMulti, withObservable } from '@polkadot/ui-api';

import CreateModal from './modals/Create';
import Address from './Address';
import translate from './translate';

type Props = ComponentProps & I18nProps & {
  addresses?: SubjectInfo[]
};

type State = {
  isCreateOpen: boolean
};

class Overview extends React.PureComponent<Props, State> {
  state: State = {
    isCreateOpen: false
  };

  render () {
    const { addresses, onStatusChange, t } = this.props;
    const { isCreateOpen } = this.state;
    const emptyScreen = !isCreateOpen && (!addresses || Object.keys(addresses).length === 0);

    return (
      <CardGrid
        buttons={
          <Button.Group>
            <Button
              isPrimary
              label={t('Add contact')}
              onClick={this.toggleCreate}
            />
          </Button.Group>
        }
        isEmpty={emptyScreen}
        emptyText={t('No contact found.')}
      >
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        {addresses && Object.keys(addresses).map((address) => (
          <Address
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
}

export default withMulti(
  Overview,
  translate,
  withObservable(addressObservable.subject, { propName: 'addresses' })
);
