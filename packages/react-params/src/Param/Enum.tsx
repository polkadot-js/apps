// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, ParamDef, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Enum, createType, getTypeDef } from '@polkadot/types';
import { Dropdown } from '@polkadot/react-components';

import Params from '../';
import Bare from './Bare';
import Static from './Static';

interface Option {
  text?: string;
  value?: string;
}

function getDisplayValue (defaultValue: RawParam | null): string | null {
  return defaultValue && defaultValue.value
    ? defaultValue.value instanceof Enum
      ? defaultValue.value.type
      : Object.keys(defaultValue.value)[0]
    : null;
}

export default function EnumParam (props: Props): React.ReactElement<Props> {
  const [currentParams, setCurrentParams] = useState<ParamDef[] | null>(null);
  const [displayValue, setDisplayValue] = useState<any>(null);
  const [{ options, subDefs }, setOptions] = useState<{ options: Option[]; subDefs: TypeDef[] }>({ options: [], subDefs: [] });
  const { className, defaultValue, isDisabled, isError, label, onChange, style, type, withLabel } = props;

  useEffect((): void => {
    const subDefs = getTypeDef(
      createType(type.type as any).toRawType()
    ).sub as TypeDef[];

    setOptions({
      options: subDefs.map(({ name }): Option => ({ text: name, value: name })),
      subDefs
    });
    setCurrentParams(
      subDefs[0]
        ? [{ name: subDefs[0].name, type: subDefs[0] }]
        : null
    );
  }, [type]);

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue);

    if (displayValue !== defaultValue) {
      setDisplayValue(newValue);
    }
  }, [defaultValue, displayValue]);

  if (isDisabled) {
    return <Static {...props} />;
  }

  const _onChange = (value: string): void => {
    const item = subDefs.find(({ name }): boolean => name === value) || null;

    setCurrentParams(
      item
        ? [{ name: item.name, type: item }]
        : null
    );
  };

  const _onChangeParam = ([first]: RawParam[]): void => {
    first && currentParams && onChange && onChange({
      isValid: first.isValid,
      value: { [currentParams[0].name as string]: first.value }
    });
  };

  return (
    <Bare
      className={className}
      style={style}
    >
      <Dropdown
        className='full'
        defaultValue={displayValue || undefined}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        options={options}
        onChange={_onChange}
        withEllipsis
        withLabel={withLabel}
      />
      {currentParams && (
        <Params
          onChange={_onChangeParam}
          params={currentParams}
        />
      )}
    </Bare>
  );
}
