// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ParamDef, Props, RawParam } from '../types';

import React, { useCallback, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { Enum, getTypeDef } from '@polkadot/types';

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

function getSubTypes (registry: Registry, type: TypeDef): TypeDef[] {
  const rawType = registry.createType(type.type as 'u32').toRawType();
  const typeDef = getTypeDef(rawType);

  return typeDef.sub as TypeDef[];
}

function EnumParam (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, onChange, overrides, registry, type, withLabel } = props;
  const [{ options, subTypes }] = useState<Options>((): Options => {
    const subTypes = getSubTypes(registry, type).filter(({ name }) => !!name && !name.startsWith('__Unused'));

    return {
      options: subTypes.map(({ name }): Option => ({
        text: name,
        value: name
      })),
      subTypes
    };
  });
  const [current, setCurrent] = useState<ParamDef[] | null>((): ParamDef[] | null => {
    const subs = getSubTypes(registry, type);

    return defaultValue.value instanceof Enum
      ? [{ name: defaultValue.value.type, type: subs[defaultValue.value.index] }]
      : [{ name: subTypes[0].name, type: subTypes[0] }];
  });
  const [{ initialEnum, initialValues }] = useState<{ initialEnum: string | null, initialValues: RawParam[] | undefined }>(() => ({
    initialEnum: defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? defaultValue.value.type
        : Object.keys(defaultValue.value as Record<string, unknown>)[0]
      : null,
    initialValues: defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? [{ isValid: true, value: defaultValue.value.inner }]
        : undefined
      : undefined
  }));

  const _onChange = useCallback(
    (value: string): void => {
      const newType = subTypes.find(({ name }) => name === value) || null;

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
        defaultValue={initialEnum}
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
          values={initialValues}
        />
      )}
    </Bare>
  );
}

export default React.memo(EnumParam);
