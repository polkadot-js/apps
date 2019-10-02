
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { ParamDef, RawParam } from '@polkadot/react-params/types';
import { I18nProps } from '@polkadot/react-components/types';
import { QueueTxRpcAdd } from '@polkadot/react-components/Status/types';

import React from 'react';
import rpc from '@polkadot/jsonrpc';
import { Button, InputRpc, TxComponent } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types';
import { isNull } from '@polkadot/util';

import translate from './translate';

interface Props extends I18nProps {
  queueRpc: QueueTxRpcAdd;
}

interface State {
  isValid: boolean;
  accountId?: string | null;
  rpc: RpcMethod;
  values: RawParam[];
}

const defaultMethod = rpc.author.methods.submitExtrinsic;

class Selection extends TxComponent<Props, State> {
  public state: State = {
    isValid: false,
    accountId: null,
    rpc: defaultMethod,
    values: []
  };

  public render (): React.ReactNode {
    const { t } = this.props;
    const { isValid, rpc } = this.state;
    const params = rpc.params.map(({ isOptional, name, type }): ParamDef => ({
      name,
      type: getTypeDef(isOptional ? `Option<${type}>` : type)
    }));

    return (
      <section className='rpc--Selection'>
        <InputRpc
          defaultValue={defaultMethod}
          help={t('The actual JSONRPC module and function to make a call to.')}
          label={t('call the selected endpoint')}
          onChange={this.onChangeMethod}
        />
        <Params
          key={`${rpc.section}.${rpc.method}:params` /* force re-render on change */}
          onChange={this.onChangeValues}
          onEnter={this.submit}
          params={params}
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            onClick={this.onSubmit}
            label={t('Submit RPC call')}
            icon='sign-in'
            ref={this.button}
          />
        </Button.Group>
      </section>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { rpc = prevState.rpc, accountId = prevState.accountId, values = prevState.values } = newState;
        const reqCount = rpc.params.reduce((count, { isOptional }): number => count + (isOptional ? 0 : 1), 0);
        const isValid = values.reduce((isValid, value): boolean => {
          return isValid && value.isValid === true;
        }, reqCount <= values.length);

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
    this.nextState({
      rpc,
      values: [] as RawParam[]
    });
  }

  private onChangeValues = (values: RawParam[]): void => {
    this.nextState({ values });
  }

  private onSubmit = (): void => {
    const { queueRpc } = this.props;
    const { accountId, rpc, values } = this.state;

    queueRpc({
      accountId,
      rpc,
      values: values
        .filter(({ value }): boolean => !isNull(value))
        .map(({ value }): any => value)
    });
  }
}

export default translate(Selection);
