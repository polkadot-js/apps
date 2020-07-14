// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ComponentMap, RawParam, RawParams, RawParamOnChangeValue } from './types';

import React, { useCallback } from 'react';

import Param from './Param';

interface Props {
  defaultValue: RawParam;
  index: number;
  isDisabled?: boolean;
  name?: string;
  onChange: (index: number, value: RawParamOnChangeValue) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  overrides?: ComponentMap;
  type: TypeDef;
  values?: RawParams | null;
}

function ParamComp ({ defaultValue, index, isDisabled, name, onChange, onEnter, onEscape, overrides, type }: Props): React.ReactElement<Props> {
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
        key={`input:${index}`}
        name={name}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        overrides={overrides}
        type={type}
      />
    </div>
  );
}

export default React.memo(ParamComp);
