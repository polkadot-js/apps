// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentMap, RawParam, RawParamOnChangeValue, RawParams } from '@canvas-ui/react-components/types';
import React, { useCallback } from 'react';

import { TypeDef } from '@polkadot/types/types';

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
