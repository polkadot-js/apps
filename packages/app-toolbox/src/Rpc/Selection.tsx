
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { RawParam } from '@polkadot/ui-params/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$RpcAdd } from '@polkadot/ui-app/Status/types';

import React from 'react';
import rpc from '@polkadot/jsonrpc';
import { getTypeDef } from '@polkadot/types';
import { Button, InputRpc } from '@polkadot/ui-app';
import Params from '@polkadot/ui-params';

import translate from './translate';

type Props = I18nProps & {
  queueRpc: QueueTx$RpcAdd
};

type State = {
  isValid: boolean,
  accountId?: string | null,
  rpc: RpcMethod,
  values: Array<RawParam>
};

const defaultMethod = rpc.author.methods.submitExtrinsic;

class Selection extends React.PureComponent<Props, State> {
  state: State = {
    isValid: false,
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

    // console.log('RPC', rpc)

    return (
      <section className='rpc--Selection'>
        <InputRpc
          defaultValue={defaultMethod}
          help={t('The actual JSONRPC module and function to make a call to.')}
          label={t('call the selected endpoint')}
          onChange={this.onChangeMethod}
        />
        {this.renderAccount()}
        <Params
          key={`${rpc.section}.${rpc.method}:params` /* force re-render on change */}
          onChange={this.onChangeValues}
          params={params}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onSubmit}
            label={t('Submit RPC call')}
          />
        </Button.Group>
      </section>
    );
  }

  // FIXME Currently the UI doesn't support signing for rpc-submitted calls
  private renderAccount () {
    return null;
  }

  private nextState (newState: State): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, accountId = prevState.accountId, values = prevState.values } = newState;
        const hasNeededKey = true;
        const isValid = values.reduce((isValid, value) => {
          return isValid && value.isValid === true;
        }, rpc.params.length === values.length && hasNeededKey);

        return {
          isValid,
          rpc,
          accountId,
          values
        };
      }
    );
  }

  private onChangeMethod = (rpc: RpcMethod): void => {
    console.log('RPC', rpc)
    this.nextState({
      rpc,
      values: [] as Array<RawParam>
    } as State);
  }

  private onChangeValues = (values: Array<RawParam>): void => {
    console.log('VALUES', values)
    this.nextState({ values } as State);
  }

  private onSubmit = (): void => {
    const { queueRpc } = this.props;
    const { accountId, rpc, values } = this.state;

    queueRpc({
      accountId,
      rpc,
      values: values.map(({ value }) =>
        value
      )
    });
  }
}

export default translate(Selection);
