
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$RpcAdd } from '@polkadot/ui-app/Status/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';
import rpc from '@polkadot/jsonrpc';
import { getTypeDef } from '@polkadot/types/codec';
import { Button, InputRpc, Params } from '@polkadot/ui-app/index';

// import Account from './Account';
import translate from './translate';

type Props = I18nProps & {
  queueRpc: QueueTx$RpcAdd
};

type State = {
  isValid: boolean,
  accountNonce: BN,
  accountId?: string | null,
  rpc: RpcMethod,
  values: Array<RawParam>
};

const defaultMethod = rpc.author.methods.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
    accountNonce: new BN(0),
    accountId: null,
    rpc: defaultMethod,
    values: []
  };

  render () {
    const { t } = this.props;
    const { isValid, rpc } = this.state;
    const params = rpc.params.map(({ name, type }) => ({
      name,
      type: getTypeDef(type)
    }));

    return (
      <section className='rpc--Selection'>
        <InputRpc
          defaultValue={defaultMethod}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          onChange={this.onChangeValues}
          params={params}
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

  // FICME Currently the UI doesn't support signing for rpc-submitted calls
  private renderAccount () {
    // const { rpc: { isSigned = false }, publicKey } = this.state;

    return null;

    // if (!isSigned) {
    //   return null;
    // }

    // return (
    //   <Account
    //     defaultValue={publicKey}
    //     onChange={this.onChangeAccount}
    //   />
    // );
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, accountNonce = prevState.accountNonce, accountId = prevState.accountId, values = prevState.values } = newState;
        const hasNeededKey = true; // rpc.isSigned !== true || (!!publicKey && publicKey.length === 32);
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, rpc.params.length === values.length && hasNeededKey);

        return {
          isValid,
          rpc,
          accountNonce: accountNonce || new BN(0),
          accountId,
          values
        };
      }
    );
  }

  // private onChangeAccount = (publicKey: Uint8Array | undefined | null, accountNonce: BN): void => {
  //   this.nextState({
  //     accountNonce,
  //     publicKey
  //   } as State);
  // }

  private onChangeMethod = (rpc: RpcMethod): void => {
    this.nextState({
      rpc,
      values: [] as Array<RawParam>
    } as State);
  }

  private onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }

  private onSubmit = (): void => {
    const { queueRpc } = this.props;
    const { accountNonce, accountId, rpc, values } = this.state;

    queueRpc({
      accountNonce,
      accountId,
      rpc,
      values: values.map(({ value }) =>
        value
      )
    });
  }
}

export default translate(Selection);
