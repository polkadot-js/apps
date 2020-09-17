// Copyright 2017-2020 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ParamDef, RawParam } from '@polkadot/react-params/types';
import { QueueTxRpcAdd } from '@polkadot/react-components/Status/types';
import { DefinitionRpcExt } from '@polkadot/types/types';

import React, { useCallback, useState } from 'react';
import { Button, InputRpc } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import { getTypeDef } from '@polkadot/types';
import { isNull } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  queueRpc: QueueTxRpcAdd;
}

interface State {
  isValid: boolean;
  accountId?: string | null;
  rpc: DefinitionRpcExt;
  values: RawParam[];
}

const defaultMethod = jsonrpc.author.submitExtrinsic;

function Selection ({ queueRpc }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ accountId, isValid, rpc, values }, setState] = useState<State>({
    accountId: null,
    isValid: false,
    rpc: defaultMethod,
    values: []
  });

  const _nextState = useCallback(
    (newState: Partial<State>): void =>
      setState((prevState: State): State => {
        const { accountId = prevState.accountId, rpc = prevState.rpc, values = prevState.values } = newState;
        const reqCount = rpc.params.reduce((count, { isOptional }): number => count + (isOptional ? 0 : 1), 0);
        const isValid = values.reduce((isValid, value) => isValid && value.isValid === true, reqCount <= values.length);

        return {
          accountId,
          isValid,
          rpc,
          values
        };
      }),
    []
  );

  const _onChangeMethod = useCallback(
    (rpc: DefinitionRpcExt): void => _nextState({ rpc, values: [] }),
    [_nextState]
  );

  const _onChangeValues = useCallback(
    (values: RawParam[]): void => _nextState({ values }),
    [_nextState]
  );

  const _onSubmit = useCallback(
    (): void => queueRpc({
      accountId,
      rpc,
      values: values
        .filter(({ value }): boolean => !isNull(value))
        .map(({ value }): any => value)
    }),
    [accountId, queueRpc, rpc, values]
  );

  const params = rpc.params.map(({ isOptional, name, type }): ParamDef => ({
    name,
    type: getTypeDef(isOptional ? `Option<${type}>` : type)
  }));

  return (
    <section className='rpc--Selection'>
      <InputRpc
        defaultValue={defaultMethod}
        help={t<string>('The actual JSONRPC module and function to make a call to.')}
        label={t<string>('call the selected endpoint')}
        onChange={_onChangeMethod}
      />
      <Params
        key={`${rpc.section}.${rpc.method}:params` /* force re-render on change */}
        onChange={_onChangeValues}
        params={params}
      />
      <Button.Group>
        <Button
          icon='sign-in-alt'
          isDisabled={!isValid}
          label={t<string>('Submit RPC call')}
          onClick={_onSubmit}
        />
      </Button.Group>
    </section>
  );
}

export default React.memo(Selection);
