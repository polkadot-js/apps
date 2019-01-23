// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BitLength, I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { Extrinsic } from '@polkadot/types';
import { BitLengthOption } from '@polkadot/ui-app/constants';
import { AddressSummary, InputAddress, InputNumber } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import keyring from '@polkadot/ui-keyring';
import FeeDisplay from '@polkadot/ui-signer/Fees';

import Submit from './Submit';
import translate from './translate';

type Props = I18nProps & ApiProps & {};

type State = {
  accountId: string | null,
  amount: BN,
  extrinsic: Extrinsic | null,
  hasAvailable: boolean,
  recipientId: string | null
};

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

const ZERO = new BN(0);

class Transfer extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      accountId: null,
      amount: ZERO,
      extrinsic: null,
      hasAvailable: true,
      recipientId: null
    };
  }

  render () {
    const { t } = this.props;
    const { accountId, extrinsic, recipientId, hasAvailable } = this.state;

    return (
      <div className='transfer--Transfer'>
        <div className='ui--row'>
          <div className='medium'>
            <InputAddress
              label={t('transfer from my account')}
              onChange={this.onChangeFrom}
              type='account'
            />
          </div>
          <div className='medium'>
            <InputAddress
              label={t('to the recipient address')}
              onChange={this.onChangeTo}
              type='all'
            />
          </div>
        </div>
        <div className='transfer--Transfer-info'>
          {this.renderAddress(accountId)}
          <div className='transfer--Transfer-data'>
            <InputNumber
              autoFocus
              bitLength={DEFAULT_BITLENGTH}
              isError={!hasAvailable}
              isSi
              label={t('send a value of')}
              onChange={this.onChangeAmount}
            />
            <FeeDisplay
              className='medium'
              accountId={accountId}
              extrinsic={extrinsic}
              onChange={this.onChangeFees}
            />
            <QueueConsumer>
              {({ queueExtrinsic }: QueueProps) => (
                <Submit
                  accountId={accountId}
                  isDisabled={!hasAvailable}
                  extrinsic={extrinsic}
                  queueExtrinsic={queueExtrinsic}
                />
              )}
            </QueueConsumer>
          </div>
          {this.renderAddress(recipientId)}
        </div>
      </div>
    );
  }

  private renderAddress (accountId: string | null) {
    if (!accountId) {
      return null;
    }

    try {
      keyring.decodeAddress(accountId);
    } catch (err) {
      return null;
    }

    return (
      <div className='transfer--Transfer-address'>
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
