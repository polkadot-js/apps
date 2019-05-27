// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/ui-app';
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

const Wrapper = styled.div`
  .addresses {
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
    isCreateOpen: false
  };

  render () {
    const { addresses, onStatusChange, t } = this.props;
    const { isCreateOpen } = this.state;

    return (
      <Wrapper>
        <Button.Group>
          <Button
            isPrimary
            label={t('Add contact')}
            onClick={this.toggleCreate}
          />
        </Button.Group>
        {isCreateOpen && (
          <CreateModal
            onClose={this.toggleCreate}
            onStatusChange={onStatusChange}
          />
        )}
        <div className='addresses'>
          {addresses && Object.keys(addresses).map((address) => (
            <Address
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
}

export default withMulti(
  Overview,
  translate,
  withObservable(addressObservable.subject, { propName: 'addresses' })
);
