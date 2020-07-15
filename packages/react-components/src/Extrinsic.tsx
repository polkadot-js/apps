// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { RawParam } from '@polkadot/react-params/types';
import { TypeDef } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';
import { GenericCall, getTypeDef } from '@polkadot/types';
import Params from '@polkadot/react-params';
import { isUndefined } from '@polkadot/util';

import InputExtrinsic from './InputExtrinsic';
import paramComponents from './Params';

interface Props {
  className?: string;
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: SubmittableExtrinsic<'promise'>) => void;
  onEnter?: () => void;
  onError?: (error?: Error | null) => void;
  onEscape?: () => void;
  withLabel?: boolean;
}

interface CallState {
  fn: SubmittableExtrinsicFunction<'promise'>;
  params: {
    name: string;
    type: TypeDef
  }[];
}

function getParams ({ meta }: SubmittableExtrinsicFunction<'promise'>): { name: string; type: TypeDef }[] {
  return GenericCall.filterOrigin(meta).map((arg): { name: string; type: TypeDef } => ({
    name: arg.name.toString(),
    type: getTypeDef(arg.type.toString())
  }));
}

function ExtrinsicDisplay ({ defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, onError, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const [extrinsic, setCall] = useState<CallState>({ fn: defaultValue, params: getParams(defaultValue) });
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
        onError && onError(error);
      }
    } else {
      onError && onError(null);
    }

    onChange(method);
  }, [extrinsic, onChange, onError, values]);

  const _onChangeMethod = useCallback(
    (fn: SubmittableExtrinsicFunction<'promise'>): void => setCall({ fn, params: getParams(fn) }),
    []
  );

  const { fn: { meta, method, section }, params } = extrinsic;

  return (
    <div className='extrinsics--Extrinsic'>
      <InputExtrinsic
        defaultValue={defaultValue}
        help={meta?.documentation.join(' ')}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={label}
        onChange={_onChangeMethod}
        withLabel={withLabel}
      />
      <Params
        key={`${section}.${method}:params` /* force re-render on change */}
        onChange={setValues}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={paramComponents}
        params={params}
      />
    </div>
  );
}

export default React.memo(ExtrinsicDisplay);
