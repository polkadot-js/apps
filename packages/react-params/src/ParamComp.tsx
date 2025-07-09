// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ComponentMap, RawParam, RawParamOnChangeValue, RawParams } from './types.js';

import React, { useCallback } from 'react';

import Param from './Param/index.js';

interface Props {
  defaultValue: RawParam;
  index: number;
  isDisabled?: boolean;
  isError?: boolean;
  name?: string;
  onChange: (index: number, value: RawParamOnChangeValue) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  overrides?: ComponentMap;
  registry: Registry;
  type: TypeDef;
  values?: RawParams | null;
  withLength?: boolean;
}

function ParamComp ({ defaultValue, index, isDisabled, isError, name, onChange, onEnter, onEscape, overrides, registry, type, withLength = true }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: RawParamOnChangeValue): void =>
      onChange(index, value),
    [index, onChange]
  );

  return (
    <div className='ui--Param-composite'>
      <Param
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        key={`input:${index}`}
        name={name}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        registry={registry}
        type={type}
        withLength={withLength}
      />
    </div>
  );
}

export default React.memo(ParamComp);
