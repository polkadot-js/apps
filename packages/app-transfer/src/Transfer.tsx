// Copyright 2017-2018 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxFees } from '@polkadot/ui-react-rx/ApiObservable/types';
import { QueueProps } from '@polkadot/ui-signer/types';
import { Fees } from './types';

import BN from 'bn.js';
import React from 'react';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import InputAddress from '@polkadot/ui-app/InputAddress';
import Input from '@polkadot/ui-app/Input';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import FeeDisplay from './Fees';
import Submit from './Submit';
import translate from './translate';

type Props = I18nProps & {
  fees: RxFees
};

type State = {
  amount: BN,
  from: Uint8Array | null,
  to: Uint8Array | null,
  txfees: Fees
};

const ZERO = new BN(0);

class Transfer extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      amount: ZERO,
      from: null,
      to: null,
      txfees: {
        hasAvailable: false,
        txtotal: ZERO
      } as Fees
    };
  }

  render () {
    const { fees, t } = this.props;
    const { amount, from, to, txfees: { hasAvailable } } = this.state;

    return (
      <div className='transfer--Transfer'>
        <div className='ui--row'>
          <div className='medium'>
            <InputAddress
              label={t('from', {
                defaultValue: 'transfer from my account'
              })}
              onChange={this.onChangeFrom}
              type='account'
            />
          </div>
          <div className='medium'>
            <InputAddress
              label={t('to', {
                defaultValue: 'to the recipient address'
              })}
              onChange={this.onChangeTo}
              type='all'
            />
          </div>
        </div>
        <div className='transfer--Transfer-info'>
          {this.renderAddress(from)}
          <div className='transfer--Transfer-data'>
            <Input
              defaultValue='0'
              isError={!hasAvailable}
              label={t('amount', {
                defaultValue: 'send a value of'
              })}
              min={0}
              onChange={this.onChangeAmount}
              type='number'
            />
            <FeeDisplay
              className='medium'
              amount={amount}
              fees={fees}
              from={from}
              to={to}
              onChange={this.onChangeFees}
            />
            <QueueConsumer>
              {({ queueExtrinsic }: QueueProps) => (
                <Submit
                  isDisabled={!hasAvailable}
                  amount={amount}
                  from={from}
                  to={to}
                  queueExtrinsic={queueExtrinsic}
                />
              )}
            </QueueConsumer>
          </div>
          {this.renderAddress(to)}
        </div>
      </div>
    );
  }

  private renderAddress (publicKey: Uint8Array | null) {
    if (!publicKey) {
      return null;
    }

    return (
      <div className='transfer--Transfer-address'>
        <AddressSummary
          value={publicKey}
          withCopy={false}
        />
      </div>
    );
  }

  private onChangeAmount = (amount: string) => {
    this.setState({ amount: new BN(amount || 0) });
  }

  private onChangeFrom = (from: Uint8Array) => {
    this.setState({ from });
  }

  private onChangeTo = (to: Uint8Array) => {
    this.setState({ to });
  }

  private onChangeFees = (txfees: Fees) => {
    this.setState({ txfees });
  }
}

export default withMulti(
  translate(Transfer),
  withObservable('fees', { propName: 'fees' })
);
