// Copyright 2017-2021 @polkadot/app-extrinsics authors & contributors
// and @canvas-ui/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import InputExtrinsic from '@canvas-ui/react-components/InputExtrinsic';
import { BareProps } from '@canvas-ui/react-components/types';
import Params from './Param/Params';
import { RawParam } from '@canvas-ui/react-components/types';
import React, { useCallback, useEffect, useState } from 'react';

import { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { GenericCall, getTypeDef } from '@polkadot/types';
import { TypeDef } from '@polkadot/types/types';
import { isUndefined } from '@polkadot/util';

import paramComponents from './Param';

interface Props extends BareProps {
  defaultValue: SubmittableExtrinsicFunction<'promise'>;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: SubmittableExtrinsic<'promise'>) => void;
  onEnter?: () => void;
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

function ExtrinsicDisplay ({ defaultValue, isDisabled, isError, isPrivate, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
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
        // swallow
      }
    }

    onChange(method);
  }, [extrinsic, onChange, values]);

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
