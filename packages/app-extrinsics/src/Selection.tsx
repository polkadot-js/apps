// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React from 'react';
import { Method } from '@polkadot/types';
import { Button, Extrinsic, InputAddress, Labelled, TxButton, TxComponent } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';
import { Nonce } from '@polkadot/ui-reactive';

import Balance from './Balance';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

type State = {
  isValid: boolean,
  isValidUnsigned: boolean,
  method: Method | null,
  accountNonce: BN,
  accountId: string
};

class Selection extends TxComponent<Props, State> {
  state: State = {
    isValid: false,
    isValidUnsigned: false
  } as State;

  render () {
    const { apiDefaultTxSudo, t } = this.props;
    const { isValid, isValidUnsigned, accountId } = this.state;
    const extrinsic = this.getExtrinsic() || apiDefaultTxSudo;

    return (
      <div className='extrinsics--Selection'>
        <InputAddress
          label={t('using the selected account')}
          onChange={this.onChangeSender}
          type='account'
        />
        <div className='ui--row'>
          <Balance
            className='medium'
            label={t('with an account balance')}
            params={accountId}
          />
          <Labelled
            className='medium'
            label={t('with a transaction nonce')}
          >
            <Nonce
              className='ui disabled dropdown selection'
              callOnResult={this.onChangeNonce}
              params={accountId}
            />
          </Labelled>
        </div>
        <br></br>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('submit the following extrinsic')}
          onChange={this.onChangeExtrinsic}
          onEnter={this.sendTx}
        />
        <br></br>
        <Button.Group>
          <TxButton
            isBasic
            isDisabled={!isValidUnsigned}
            isUnsigned
            label={t('Submit Inherent')}
            extrinsic={extrinsic}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={t('Submit Transaction')}
            extrinsic={extrinsic}
            ref={this.button}
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
          isValidUnsigned: !!method,
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

  private getExtrinsic (): SubmittableExtrinsic | null {
    const { api } = this.props;
    const { method } = this.state;

    if (!method) {
      return null;
    }

    const fn = Method.findFunction(method.callIndex);

    return api.tx[fn.section][fn.method](...method.args);
  }
}

export default withMulti(
  Selection,
  translate,
  withApi
);
