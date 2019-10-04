// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import React from 'react';
import { Button, Extrinsic, InputAddress, Labelled, TxButton, TxComponent } from '@polkadot/react-components';
import { withApi, withMulti } from '@polkadot/react-api';
import { Nonce } from '@polkadot/react-query';

import Balance from './Balance';
import translate from './translate';

interface Props extends ApiProps, I18nProps {
  queueExtrinsic: QueueTxExtrinsicAdd;
}

interface State {
  isValid: boolean;
  isValidUnsigned: boolean;
  method: Call | null;
  accountNonce?: BN;
  accountId?: string | null;
}

class Selection extends TxComponent<Props, State> {
  public state: State = {
    isValid: false,
    isValidUnsigned: false,
    method: null
  };

  public render (): React.ReactNode {
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
            label={t('Submit Unsigned')}
            icon='sign-in'
            extrinsic={extrinsic}
          />
          <Button.Or />
          <TxButton
            accountId={accountId}
            isDisabled={!isValid}
            isPrimary
            label={t('Submit Transaction')}
            icon='sign-in'
            extrinsic={extrinsic}
            ref={this.button}
          />
        </Button.Group>
      </div>
    );
  }

  private nextState (newState: Partial<State>): void {
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

  private onChangeExtrinsic = (method: Call | null = null): void => {
    this.nextState({ method });
  }

  private onChangeNonce = (accountNonce: BN = new BN(0)): void => {
    this.nextState({ accountNonce });
  }

  private onChangeSender = (accountId: string | null): void => {
    this.nextState({ accountId, accountNonce: new BN(0) });
  }

  private getExtrinsic (): SubmittableExtrinsic | null {
    const { api } = this.props;
    const { method } = this.state;

    if (!method) {
      return null;
    }

    const fn = api.findCall(method.callIndex);

    return api.tx[fn.section][fn.method](...method.args);
  }
}

export default withMulti(
  Selection,
  translate,
  withApi
);
