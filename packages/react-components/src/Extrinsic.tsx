// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { RawParam } from '@polkadot/react-params/types';
import type { TypeDef } from '@polkadot/types/types';

import React, { useCallback, useEffect, useState } from 'react';

import Params from '@polkadot/react-params';
import { getTypeDef } from '@polkadot/types/create';
import { isUndefined } from '@polkadot/util';

import InputExtrinsic from './InputExtrinsic';
import paramComponents from './Params';

interface Props {
  className?: string;
  defaultArgs?: RawParam[];
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  filter?: (section: string, method?: string) => boolean;
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

interface ParamDef {
  name: string;
  type: TypeDef;
}

interface CallState {
  extrinsic: {
    fn: SubmittableExtrinsicFunction<'promise'>;
    params: ParamDef[];
  },
  values: RawParam[];
}

function isValuesValid (params: ParamDef[], values: RawParam[]): boolean {
  return values.reduce((isValid, value): boolean =>
    isValid &&
    !isUndefined(value) &&
    !isUndefined(value.value) &&
    value.isValid, params.length === values.length
  );
}

function getParams ({ meta }: SubmittableExtrinsicFunction<'promise'>): ParamDef[] {
  return meta.args.map(({ name, type, typeName }): { name: string; type: TypeDef } => ({
    name: name.toString(),
    type: {
      ...getTypeDef(type.toString()),
      ...(typeName.isSome
        ? { typeName: typeName.unwrap().toString() }
        : {}
      )
    }
  }));
}

function getCallState (fn: SubmittableExtrinsicFunction<'promise'>, values: RawParam[] = []): CallState {
  return {
    extrinsic: {
      fn,
      params: getParams(fn)
    },
    values
  };
}

function ExtrinsicDisplay ({ defaultArgs, defaultValue, filter, isDisabled, isError, isPrivate, label, onChange, onEnter, onError, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const [{ extrinsic, values }, setDisplay] = useState<CallState>(() => getCallState(defaultValue, defaultArgs));

  useEffect((): void => {
    const isValid = isValuesValid(extrinsic.params, values);
    let method;

    if (isValid) {
      try {
        method = extrinsic.fn(...values.map(({ value }) => value));
      } catch (error) {
        onError && onError(error as Error);
      }
    } else {
      onError && onError(null);
    }

    onChange(method);
  }, [extrinsic, onChange, onError, values]);

  const _onChangeMethod = useCallback(
    (fn: SubmittableExtrinsicFunction<'promise'>) =>
      setDisplay((prev): CallState =>
        fn.section === prev.extrinsic.fn.section && fn.method === prev.extrinsic.fn.method
          ? prev
          : getCallState(fn)
      ),
    []
  );

  const _setValues = useCallback(
    (values: RawParam[]) =>
      setDisplay(({ extrinsic }) => ({ extrinsic, values })),
    []
  );

  const { fn: { meta, method, section }, params } = extrinsic;

  return (
    <div className='extrinsics--Extrinsic'>
      <InputExtrinsic
        defaultValue={defaultValue}
        filter={filter}
        help={meta?.docs.join(' ')}
        isDisabled={isDisabled}
        isError={isError}
        isPrivate={isPrivate}
        label={label}
        onChange={_onChangeMethod}
        withLabel={withLabel}
      />
      <Params
        key={`${section}.${method}:params` /* force re-render on change */}
        onChange={_setValues}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={paramComponents}
        params={params}
        values={values}
      />
    </div>
  );
}

export default React.memo(ExtrinsicDisplay);
