// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps } from './types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import styled from 'styled-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/ui-api';

import CreateModal from './modals/Create';
import Account from './Account';

type Props = ComponentProps & {
  accounts?: SubjectInfo[]
};

type State = {
  isCreateOpen: boolean,
  isImportOpen: boolean
};

const Wrapper = styled.div`
  .accounts {
    display: flex;
    flex-wrap: wrap;

    .spacer {
      flex: 1 1;
      margin: .25rem;
      padding: 1rem 1.5rem;
    }
  }
`;

class Overview extends React.PureComponent<Props, State> {
  state: State = {
    isCreateOpen: false,
    isImportOpen: false
  };

  render () {
    const { accounts, onStatusChange } = this.props;
    const { isCreateOpen } = this.state;

    if (!accounts || Object.keys(accounts).length === 0) {
      return null;
    }

    return (
      <Wrapper>
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        <div className='accounts'>
          {Object.keys(accounts).map((address) => (
            <Account
              address={address}
              key={address}
            />
          ))}
          <div className='spacer' />
        </div>
      </Wrapper>
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
  withObservable(accountObservable.subject, { propName: 'accounts' })
);
