// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd, QueueTx$Unclog } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import React from 'react';
import SubmittableExtrinsic from '@polkadot/api/promise/SubmittableExtrinsic';
import { Method } from '@polkadot/types';
import { Button } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-react-rx/with';

import Account from './Account';
import ExtrinsicDisplay from './Extrinsic';
import Nonce from './Nonce';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueUnclog: QueueTx$Unclog
};

type State = {
  isValid: boolean,
  method: Method | null,
  accountNonce: BN,
  accountId: string
};

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false
  } as State;

  render () {
    const { apiPromise, t } = this.props;
    const { isValid, accountId } = this.state;

    return (
      <div className='extrinsics--Selection'>
        <Account
          isInput={false}
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={this.onChangeSender}
          type='account'
        />
        <ExtrinsicDisplay
          defaultValue={apiPromise.tx.balances.transfer}
          labelMethod={t('display.method', {
            defaultValue: 'submit the following extrinsic'
          })}
          onChange={this.onChangeExtrinsic}
        />
        <Nonce
          label={t('display.nonce', {
            defaultValue: 'with an index'
          })}
          rxChange={this.onChangeNonce}
          value={accountId}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            onClick={this.onQueueInherent}
            text={t('submit.label', {
              defaultValue: 'Submit Inherent'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onQueueExtrinsic}
            text={t('submit.label', {
              defaultValue: 'Submit Transaction'
            })}
          />
        </Button.Group>
      </div>
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { method = prevState.method, accountNonce = prevState.accountNonce, accountId = prevState.accountId } = newState;
        const isValid = !!(
          accountId &&
          accountId.length &&
          method
        );

        return {
          method,
          isValid,
          accountNonce,
          accountId
        };
      }
    );
  }

  private onChangeExtrinsic = (method: Method | null = null): void => {
    this.nextState({ method } as State);
  }

  private onChangeNonce = (accountNonce: BN = new BN(0)): void => {
    const { queueUnclog } = this.props;

    this.nextState({ accountNonce } as State);

    queueUnclog(accountNonce);
  }

  private onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) } as State);
  }

  private onQueue (isUnsigned: boolean): void {
    const { apiPromise, queueExtrinsic } = this.props;
    const { accountNonce, method, isValid, accountId } = this.state;

    if (!isValid || !method) {
      return;
    }

    queueExtrinsic({
      accountId,
      accountNonce,
      extrinsic: new SubmittableExtrinsic(apiPromise, method),
      isUnsigned
    });
  }

  private onQueueExtrinsic = (): void => {
    this.onQueue(false);
  }

  private onQueueInherent = (): void => {
    this.onQueue(true);
  }
}

export default withMulti(
  Selection,
  translate,
  withApi
);
