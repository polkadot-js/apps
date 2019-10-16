// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ComponentMap, RawParam, RawParams, RawParamOnChangeValue } from './types';

import React from 'react';

import Param from './Param';

interface Props {
  defaultValue: RawParam;
  index: number;
  isDisabled?: boolean;
  name?: string;
  onChange: (index: number, value: RawParamOnChangeValue) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  type: TypeDef;
  values?: RawParams | null;
}

export default function ParamComp ({ defaultValue, index, isDisabled, name, onChange, onEnter, overrides, type }: Props): React.ReactElement<Props> {
  const _onChange = (value: RawParamOnChangeValue): void =>
    onChange(index, value);

  return (
    <div className='ui--Param-composite'>
      <Param
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        key={`input:${index}`}
        name={name}
        onChange={_onChange}
        onEnter={onEnter}
        overrides={overrides}
        type={type}
      />
    </div>
  );
}
