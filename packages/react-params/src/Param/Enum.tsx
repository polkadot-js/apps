// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';

import type { TypeDef } from '@polkadot/types/types';
import { Dropdown } from '@polkadot/react-components';
import { Enum, getTypeDef } from '@polkadot/types';

import type { ParamDef, Props, RawParam } from '../types';
import Params from '../';
import Bare from './Bare';
import Static from './Static';

interface Option {
  text?: string;
  value?: string;
}

interface Options {
  options: Option[];
  subTypes: TypeDef[];
}

function EnumParam (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, onChange, overrides, registry, type, withLabel } = props;
  const [current, setCurrent] = useState<ParamDef[] | null>(null);
  const [initialValue, setInitialValue] = useState<string | null>(null);
  const [{ options, subTypes }, setOptions] = useState<Options>({ options: [], subTypes: [] });

  useEffect((): void => {
    const rawType = registry.createType(type.type as 'u32').toRawType();
    const typeDef = getTypeDef(rawType);
    const subTypes = typeDef.sub as TypeDef[];

    setOptions({
      options: subTypes.map(({ name }): Option => ({
        text: name,
        value: name
      })),
      subTypes
    });
    setCurrent([{ name: subTypes[0].name, type: subTypes[0] }]);
  }, [registry, type]);

  useEffect((): void => {
    setInitialValue(
      defaultValue && defaultValue.value
        ? defaultValue.value instanceof Enum
          ? defaultValue.value.type
          : Object.keys(defaultValue.value as Record<string, unknown>)[0]
        : null
    );
  }, [defaultValue]);

  const _onChange = useCallback(
    (value: string): void => {
      const newType = subTypes.find(({ name }): boolean => name === value) || null;

      setCurrent(
        newType
          ? [{ name: newType.name, type: newType }]
          : null
      );
    },
    [subTypes]
  );

  const _onChangeParam = useCallback(
    ([{ isValid, value }]: RawParam[]): void => {
      current && onChange && onChange({
        isValid,
        value: { [current[0].name as string]: value }
      });
    },
    [current, onChange]
  );

  if (isDisabled) {
    return <Static {...props} />;
  }

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={initialValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        options={options}
        withEllipsis
        withLabel={withLabel}
      />
      {current && (
        <Params
          onChange={_onChangeParam}
          overrides={overrides}
          params={current}
          registry={registry}
        />
      )}
    </Bare>
  );
}

export default React.memo(EnumParam);
