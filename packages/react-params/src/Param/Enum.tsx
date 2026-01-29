// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ParamDef, Props, RawParam } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { Enum, getTypeDef } from '@polkadot/types';
import { isObject } from '@polkadot/util';

import Params from '../index.js';
import Bare from './Bare.js';

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
  return getTypeDef(
    registry.createType(type.type as '(u32, u32)').toRawType()
  ).sub as TypeDef[];
}

function getOptions (registry: Registry, type: TypeDef): Options {
  const subTypes = getSubTypes(registry, type).filter(({ name }) =>
    !!name &&
    !name.startsWith('__Unused')
  );

  return {
    options: subTypes.map(({ name }): Option => ({
      text: name,
      value: name
    })),
    subTypes
  };
}

function getInitial (defaultValue: RawParam, options: Option[]): Initial {
  if (defaultValue?.value) {
    if (defaultValue.value instanceof Enum) {
      return {
        initialEnum: defaultValue.value.type,
        initialParams: [{
          isValid: true,
          value: defaultValue.value.inner
        }]
      };
    } else if (isObject<Record<string, unknown>>(defaultValue.value)) {
      const [initialEnum, value] = Object.entries(defaultValue.value)[0];

      // Ensure that the defaultValue is actually in our enum, e.g. it
      // may start with __Unused<x> values, in which case it would be
      // invalid
      if (options.some(({ value }) => value === initialEnum)) {
        return {
          initialEnum,
          initialParams: [{
            isValid: true,
            value
          }]
        };
      }
    }
  }

  return {
    initialEnum: options[0]?.value,
    initialParams: undefined
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
      if (isDisabled) {
        return;
      }

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
    [isDisabled, subTypes]
  );

  const _onChangeParam = useCallback(
    ([{ isValid, value }]: RawParam[]): void => {
      if (isDisabled) {
        return;
      }

      current && onChange && onChange({
        isValid,
        value: { [current[0].name || 'unknown']: value }
      });
    },
    [current, isDisabled, onChange]
  );

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
          isDisabled={isDisabled}
          isError={isError}
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
