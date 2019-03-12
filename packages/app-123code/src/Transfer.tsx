// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, TxButton } from '@polkadot/ui-app/index';

type Props = {
  accountId?: string
};
type State = {
  amount?: BN;
  recipientId?: string;
};

export default class Transfer extends React.PureComponent<Props> {
  state: State = {};

  render () {
    const { accountId } = this.props;
    const { amount, recipientId } = this.state;

    return (
      <section>
        <h1>transfer</h1>
        <div className='ui--row'>
          <div className='large'>
            <InputAddress
              label='recipient address for this transfer'
              onChange={this.onChangeRecipient}
              type='all'
            />
            <InputBalance
              label='amount to transfer'
              onChange={this.onChangeAmount}
            />
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='make transfer'
                params={[recipientId, amount]}
                tx='balances.transfer'
              />
            </Button.Group>
          </div>
          <div className='template--summary small'>Make a transfer from any account you control to another account. Transfer fees and per-transaction fees apply and will be calculated upon submission.</div>
        </div>
      </section>
    );
  }

  private onChangeAmount = (amount?: BN): void => {
    this.setState({ amount });
  }

  private onChangeRecipient = (recipientId?: string): void => {
    this.setState({ recipientId });
  }
}
