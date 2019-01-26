// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd, ActionStatus } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Method } from '@polkadot/types';
import { Button } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-api/index';

import Account from './Account';
import ExtrinsicDisplay from './Extrinsic';
import Nonce from './Nonce';
import translate from './translate';

const MAX_TRANSACTION_SIZE = 10 * 24 * 24;

type Props = ApiProps & I18nProps & {
  onStatusChange: (status: ActionStatus) => void,
  queueExtrinsic: QueueTx$ExtrinsicAdd
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
    const { apiDefaultTx, api, t } = this.props;
    const { isValid, accountId } = this.state;
    const defaultExtrinsic = (() => {
      try {
        return api.tx.balances.transfer;
      } catch (error) {
        return apiDefaultTx;
      }
    })();

    return (
      <div className='extrinsics--Selection'>
        <Account
          isInput={false}
          label={t('using the selected account')}
          onChange={this.onChangeSender}
          type='account'
        />
        <ExtrinsicDisplay
          defaultValue={defaultExtrinsic}
          labelMethod={t('submit the following extrinsic')}
          onChange={this.onChangeExtrinsic}
        />
        <Nonce
          label={t('with an index')}
          callOnResult={this.onChangeNonce}
          value={accountId}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            onClick={this.onQueueInherent}
            text={t('Submit Inherent')}
          />
          <Button.Or />
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onQueueExtrinsic}
            text={t('Submit Transaction')}
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
    this.nextState({ accountNonce } as State);
  }

  private onChangeSender = (accountId: string): void => {
    this.nextState({ accountId, accountNonce: new BN(0) } as State);
  }

  private onQueue (isUnsigned: boolean): void {
    const { api, queueExtrinsic, onStatusChange } = this.props;
    const { method, isValid, accountId } = this.state;

    if (!isValid || !method) {
      return;
    }

    const fn = Method.findFunction(method.callIndex);
    const extrinsic = api.tx[fn.section][fn.method](...method.args);

    if (extrinsic.toU8a().length > MAX_TRANSACTION_SIZE) {
      onStatusChange({
        action: fn.section + '.' + fn.method,
        status: 'error',
        message: 'Warning: This transaction will likely be rejected by the network as it is greater \
                  than the maximum size of ' + MAX_TRANSACTION_SIZE / (24 * 24) + 'MB'
      });
    }

    queueExtrinsic({
      accountId: isUnsigned
        ? undefined
        : accountId,
      extrinsic: extrinsic,
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
