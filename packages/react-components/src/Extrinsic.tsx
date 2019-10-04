// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { RawParam } from '@polkadot/react-params/types';
import { Call } from '@polkadot/types/interfaces';
import { CallFunction, TypeDef } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { GenericCall, getTypeDef } from '@polkadot/types';
import { InputExtrinsic } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { isUndefined } from '@polkadot/util';

import paramComponents from './Params';

interface Props extends BareProps {
  defaultValue: CallFunction;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: Call) => void;
  onEnter?: () => void;
  withLabel?: boolean;
}

function getParams ({ meta }: CallFunction): { name: string; type: TypeDef }[] {
  return GenericCall.filterOrigin(meta).map((arg): { name: string; type: TypeDef } => ({
    name: arg.name.toString(),
    type: getTypeDef(arg.type.toString())
  }));
}

export default function ExtrinsicDisplay ({ defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, withLabel }: Props): React.ReactElement<Props> {
  const [extrinsic, setCall] = useState<{ fn: CallFunction; params: { name: string; type: TypeDef }[] }>({ fn: defaultValue, params: getParams(defaultValue) });
  const [values, setValues] = useState<RawParam[]>([]);

  useEffect((): void => {
    setValues([]);
  }, [extrinsic]);

  useEffect((): void => {
    const isValid = values.reduce((isValid, value): boolean =>
      isValid &&
      !isUndefined(value) &&
      !isUndefined(value.value) &&
      value.isValid, extrinsic.params.length === values.length
    );

    let method;

    if (isValid) {
      try {
        method = extrinsic.fn(...values.map(({ value }): any => value));
      } catch (error) {
        // swallow
      }
    }

    onChange(method);
  }, [extrinsic, values]);

  const _onChangeMethod = (fn: CallFunction): void => setCall({ fn, params: getParams(fn) });

  const { fn: { meta, method, section }, params } = extrinsic;

  return (
    <div className='extrinsics--Extrinsic'>
      <InputExtrinsic
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={label}
        onChange={_onChangeMethod}
        withLabel={withLabel}
        help={meta && meta.documentation && meta.documentation.join(' ')}
      />
      <Params
        key={`${section}.${method}:params` /* force re-render on change */}
        onChange={setValues}
        onEnter={onEnter}
        overrides={paramComponents}
        params={params}
      />
    </div>
  );
}
