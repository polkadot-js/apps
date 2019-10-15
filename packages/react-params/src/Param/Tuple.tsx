// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec, TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { isUndefined } from '@polkadot/util';

import Bare from './Bare';
import findComponent from './findComponent';

export default function Tuple ({ className, defaultValue, isDisabled, onChange, onEnter, style, type, withLabel }: Props): React.ReactElement<Props> {
  const [{ Components, subTypes }, setComponents] = useState<{ Components: React.ComponentType<Props>[]; subTypes: TypeDef[] }>({ Components: [], subTypes: [] });
  const [values, setValues] = useState<RawParam[]>([]);

  useEffect((): void => {
    const subTypes: TypeDef[] = type.sub && Array.isArray(type.sub)
      ? type.sub
      : [];

    setComponents({
      Components: subTypes.map((type): React.ComponentType<Props> => findComponent(type)),
      subTypes
    });
  }, [type]);

  useEffect((): void => {
    setValues(
      (((defaultValue && defaultValue.value) || []) as any[]).map((value): { isValid: boolean; value: Codec } =>
        isUndefined(value) || isUndefined(value.isValid)
          ? { isValid: !isUndefined(value), value }
          : value
      )
    );
  }, [defaultValue]);

  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
      value: values.map(({ value }): any => value)
    });
  }, [values]);

  const _onChange = (index: number): (value: RawParam) => void =>
    (value: RawParam): void =>
      setValues(values.map((prev, prevIndex): RawParam =>
        (prevIndex === index)
          ? value
          : prev
      ));

  return (
    <Bare
      className={className}
      style={style}
    >
      {Components.map((Component, index): React.ReactNode => (
        <Component
          defaultValue={values[index] || {}}
          isDisabled={isDisabled}
          key={index}
          label={subTypes[index].type}
          onChange={_onChange(index)}
          onEnter={onEnter}
          type={subTypes[index]}
          withLabel={withLabel}
        />
      ))}
    </Bare>
  );
}
