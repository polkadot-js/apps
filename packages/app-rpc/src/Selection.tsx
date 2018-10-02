// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Method } from '@polkadot/jsonrpc/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$MessageAdd } from '@polkadot/ui-signer/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';
import rpc from '@polkadot/jsonrpc';
import Button from '@polkadot/ui-app/Button';
import InputRpc from '@polkadot/ui-app/InputRpc';
import Params from '@polkadot/ui-app/Params';
import rawToValues from '@polkadot/ui-signer/rawToValues';

import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  queueAdd: QueueTx$MessageAdd
};

type State = {
  isValid: boolean,
  accountNonce: BN,
  publicKey?: Uint8Array | null,
  rpc: Method,
  values: Array<RawParam>
};

// @ts-ignore This is horrible, would like _some_ help from TS
const defaultMethod = rpc.author.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
    accountNonce: new BN(0),
    publicKey: null,
    rpc: defaultMethod,
    values: []
  };

  render () {
    const { t } = this.props;
    const { isValid, rpc } = this.state;

    return (
      <section className='rpc--Selection'>
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          item={rpc}
          onChange={this.onChangeValues}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onSubmit}
            text={t('submit', {
              defaultValue: 'Submit RPC call'
            })}
          />
        </Button.Group>
      </section>
    );
  }

  private renderAccount () {
    const { rpc: { isSigned = false }, publicKey } = this.state;

    if (!isSigned) {
      return null;
    }

    return (
      <Account
        defaultValue={publicKey}
        onChange={this.onChangeAccount}
      />
    );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, accountNonce = prevState.accountNonce, publicKey = prevState.publicKey, values = prevState.values } = newState;
        const hasNeededKey = rpc.isSigned !== true || (!!publicKey && publicKey.length === 32);
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, rpc.params.length === values.length && hasNeededKey);

        return {
          isValid,
          rpc,
          accountNonce: accountNonce || new BN(0),
          publicKey,
          values
        };
      }
    );
  }

  private onChangeAccount = (publicKey: Uint8Array | undefined | null, accountNonce: BN): void => {
    this.nextState({
      accountNonce,
      publicKey
    } as State);
  }

  private onChangeMethod = (rpc: Method): void => {
    this.nextState({
      rpc,
      values: [] as Array<RawParam>
    } as State);
  }

  private onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }

  private onSubmit = (): void => {
    const { queueAdd } = this.props;
    const { isValid, accountNonce, publicKey, rpc, values } = this.state;

    queueAdd({
      isValid,
      accountNonce,
      publicKey,
      rpc,
      values: rawToValues(values)
    });
  }
}

export default translate(Selection);
