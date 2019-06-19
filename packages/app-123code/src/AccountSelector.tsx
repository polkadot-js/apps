// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Bubble, InputAddress } from '@polkadot/ui-app';
import { AccountIndex, Balance, Nonce } from '@polkadot/ui-reactive';

type Props = {
  className?: string,
  onChange: (accountId?: string) => void
};

type State = {
  accountId?: string
};

class AccountSelector extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { className } = this.props;
    const { accountId } = this.state;

    return (
      <section className={`template--AccountSelector ui--row ${className}`}>
        <InputAddress
          className='medium'
          label='my default account'
          onChange={this.onChange}
          type='account'
        />
        <div className='medium'>
          <Bubble color='teal' icon='address card' label='index'>
            <AccountIndex params={accountId} />
          </Bubble>
          <Bubble color='yellow' icon='adjust' label='balance'>
            <Balance params={accountId} />
          </Bubble>
          <Bubble color='yellow' icon='target' label='transactions'>
            <Nonce params={accountId} />
          </Bubble>
        </div>
      </section>
    );
  }

  private onChange = (accountId?: string): void => {
    const { onChange } = this.props;

    this.setState({ accountId }, () =>
      onChange(accountId)
    );
  }
}

export default styled(AccountSelector)`
  align-items: flex-end;

  .summary {
    text-align: center;
  }
`;
