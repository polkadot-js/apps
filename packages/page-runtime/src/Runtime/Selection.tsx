// Copyright 2017-2025 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParamDef, RawParam } from '@polkadot/react-params/types';
import type { DefinitionCallNamed } from '@polkadot/types/types';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, InputCalls } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';

import { useTranslation } from '../translate.js';

interface Props {
  onSubmit: (call: DefinitionCallNamed, values: RawParam[]) => void;
}

interface State {
  isValid: boolean;
  method: DefinitionCallNamed | null;
  values: RawParam[];
}

/**
 * Declares the Runtime APIs that do not require extrinsic length to be prefixed when converting them to a u8 array.
 * REF: https://github.com/polkadot-js/apps/blob/master/packages/react-params/src/Param/BaseBytes.tsx#L99
*/
const WITHOUT_LENGTH = ['transactionPaymentApi'];

function Selection ({ onSubmit }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, method, values }, setState] = useState<State>({
    isValid: false,
    method: null,
    values: []
  });

  const params = useMemo(
    () => method
      ? method.params.map(({ name, type }): ParamDef => ({
        name,
        type: getTypeDef(type)
      }))
      : [],
    [method]
  );

  const _nextState = useCallback(
    (newState: Partial<State>) => setState((prevState: State): State => {
      const { method = prevState.method, values = prevState.values } = newState;
      const isValid = values.reduce((isValid, value) => isValid && value.isValid === true, !!method && method.params.length <= values.length);

      return {
        isValid,
        method,
        values
      };
    }),
    []
  );

  const _onChangeMethod = useCallback(
    (method: DefinitionCallNamed) => _nextState({ method, values: [] }),
    [_nextState]
  );

  const _onChangeValues = useCallback(
    (values: RawParam[]) => _nextState({ values }),
    [_nextState]
  );

  const _onSubmit = useCallback(
    (): void => {
      method && onSubmit(method, values);
    },
    [onSubmit, method, values]
  );

  return (
    <section className='runtime--Selection'>
      <InputCalls
        label={t('call the selected endpoint')}
        onChange={_onChangeMethod}
      />
      {method && (
        <Params
          key={`${method.section}.${method.method}:params` /* force re-render on change */}
          onChange={_onChangeValues}
          params={params}
          withLength={!WITHOUT_LENGTH.includes(method.section)}
        />
      )}
      <Button.Group>
        <Button
          icon='sign-in-alt'
          isDisabled={!isValid || !method}
          label={t('Submit Runtime call')}
          onClick={_onSubmit}
        />
      </Button.Group>
    </section>
  );
}

export default React.memo(Selection);
