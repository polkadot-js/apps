// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { IExtrinsic } from '@polkadot/types/types';
import { AddressSummary, InputAddress, InputBalance } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';
import keyring from '@polkadot/ui-keyring';
import Checks from '@polkadot/ui-signer/Checks';

import Submit from './Submit';
import translate from './translate';

type Props = I18nProps & ApiProps & {};

type State = {
  accountId: string | null,
  amount: BN,
  extrinsic: IExtrinsic | null,
  hasAvailable: boolean,
  recipientId: string | null
};

const ZERO = new BN(0);

class Transfer extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    amount: ZERO,
    extrinsic: null,
    hasAvailable: true,
    recipientId: null
  };

  render () {
    const { t } = this.props;
    const { accountId, extrinsic, recipientId, hasAvailable } = this.state;

    return (
      <div className='transfer--Transfer'>
        <div className='transfer--Transfer-info'>
          {this.renderAddress(accountId, 'medium')}
          <div className='transfer--Transfer-data'>
            <InputAddress
              help={t('Select the account you want to send funds from.')}
              label={t('from')}
              onChange={this.onChangeFrom}
              type='account'
            />
            <InputAddress
              help={t('Select a contact or paste the address you want to send funds to.')}
              label={t('to')}
              onChange={this.onChangeTo}
              type='all'
            />
            <InputBalance
              autoFocus
              help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 mili is equivalent to sending 0.001.')}
              isError={!hasAvailable}
              label={t('amount')}
              onChange={this.onChangeAmount}
            />
            <Checks
              accountId={accountId}
              extrinsic={extrinsic}
              isSendable
              onChange={this.onChangeFees}
            />
            <Submit
              accountId={accountId}
              isDisabled={!hasAvailable}
              extrinsic={extrinsic}
            />
          </div>
          {this.renderAddress(recipientId, 'large')}
        </div>
      </div>
    );
  }

  private renderAddress (accountId: string | null, media: 'large' | 'medium') {
    if (!accountId) {
      return null;
    }

    try {
      keyring.decodeAddress(accountId);
    } catch (err) {
      return null;
    }

    return (
      <div className={`transfer--Transfer-address ui--media-${media}`}>
        <AddressSummary
          value={accountId}
          withCopy={false}
        />
      </div>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { accountId = prevState.accountId, amount = prevState.amount, recipientId = prevState.recipientId, hasAvailable = prevState.hasAvailable } = newState;
      const extrinsic = accountId && recipientId
        ? api.tx.balances.transfer(recipientId, amount)
        : null;

      return {
        accountId,
        amount,
        extrinsic,
        hasAvailable,
        recipientId
      };
    });
  }

  private onChangeFrom = (accountId: string) => {
    this.nextState({ accountId });
  }

  private onChangeAmount = (amount: BN = new BN(0)) => {
    this.nextState({ amount });
  }

  private onChangeTo = (recipientId: string) => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean) => {
    this.setState({ hasAvailable });
  }
}

export default withMulti(
  Transfer,
  translate,
  withApi
);
