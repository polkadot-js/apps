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

interface Initial {
  initialEnum: string | undefined | null;
  initialParams: RawParam[] | undefined | null;
}

function getSubTypes (registry: Registry, type: TypeDef): TypeDef[] {
  const rawType = registry.createType(type.type as 'u32').toRawType();

  return getTypeDef(rawType).sub as TypeDef[];
}

function getOptions (registry: Registry, type: TypeDef): Options {
  const subTypes = getSubTypes(registry, type).filter(({ name }) => !!name && !name.startsWith('__Unused'));

  return {
    options: subTypes.map(({ name }): Option => ({
      text: name,
      value: name
    })),
    subTypes
  };
}

function getInitial (defaultValue: RawParam, options: Option[]): Initial {
  return {
    initialEnum: defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? defaultValue.value.type
        : Object.keys(defaultValue.value as Record<string, unknown>)[0]
      : options[0] && options[0].value,
    initialParams: defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? [{ isValid: true, value: defaultValue.value.inner }]
        : undefined
      : undefined
  };
}

function getCurrent (registry: Registry, type: TypeDef, defaultValue: RawParam, subTypes: TypeDef[]): ParamDef[] | null {
  const subs = getSubTypes(registry, type);

  return defaultValue.value instanceof Enum
    ? [{ name: defaultValue.value.type, type: subs[defaultValue.value.index] }]
    : [{ name: subTypes[0].name, type: subTypes[0] }];
}

function EnumParam (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue, isDisabled, isError, label, onChange, overrides, registry, type, withLabel } = props;
  const [{ options, subTypes }] = useState<Options>(() => getOptions(registry, type));
  const [current, setCurrent] = useState<ParamDef[] | null>(() => getCurrent(registry, type, defaultValue, subTypes));
  const [{ initialEnum, initialParams }, setInitial] = useState<Initial>(() => getInitial(defaultValue, options));

  const _onChange = useCallback(
    (value: string): void => {
      const newType = subTypes.find(({ name }) => name === value) || null;

      setCurrent(
        newType
          ? [{ name: newType.name, type: newType }]
          : null
      );

      if (newType) {
        // if the enum changes, we want to discard the original initParams,
        // these are not applicable anymore, rather use empty defaults
        setInitial((prev) =>
          newType.name === prev.initialEnum
            ? prev
            : { initialEnum: prev.initialEnum, initialParams: null }
        );
      }
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
          values={initialParams}
        />
      )}
    </Bare>
  );
}

export default React.memo(EnumParam);
