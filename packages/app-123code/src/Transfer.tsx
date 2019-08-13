// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { Button, InputAddress, InputBalance, TxButton, TxComponent } from '@polkadot/react-components';

import Summary from './Summary';

interface Props {
  accountId?: string;
}
interface State {
  amount?: BN;
  recipientId?: string;
}

export default class Transfer extends TxComponent<Props, State> {
  public state: State = {};

  public render (): React.ReactNode {
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
              onEnter={this.sendTx}
              type='all'
            />
            <InputBalance
              label='amount to transfer'
              onChange={this.onChangeAmount}
              onEnter={this.sendTx}
            />
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='make transfer'
                params={[recipientId, amount]}
                tx='balances.transfer'
                ref={this.button}
              />
            </Button.Group>
          </div>
          <Summary className='small'>Make a transfer from any account you control to another account. Transfer fees and per-transaction fees apply and will be calculated upon submission.</Summary>
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
