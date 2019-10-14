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
  const [values, setValues] = useState<RawParam[]>([]);
  const [{ Components, subDefs }, setComponents] = useState<{ Components: React.ComponentType<Props>[]; subDefs: TypeDef[] }>({ Components: [], subDefs: [] });

  useEffect((): void => {
    const subDefs = type.sub && Array.isArray(type.sub)
      ? type.sub
      : [];

    setValues(
      (defaultValue.value as any[]).map((value): { isValid: boolean; value: Codec } =>
        isUndefined(value) || isUndefined(value.isValid)
          ? { isValid: !isUndefined(value), value }
          : value
      )
    );
    setComponents({
      Components: subDefs.map((type): React.ComponentType<Props> => findComponent(type)),
      subDefs
    });
  }, [type]);

  const _onChange = (index: number): (value: RawParam) => void => {
    return (value: RawParam): void => {
      const newValues = values.map((prevValue, valIndex): RawParam =>
        (valIndex === index)
          ? value
          : prevValue
      );

      setValues(newValues);

      onChange && onChange({
        isValid: newValues.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
        value: values.map(({ value }): any => value)
      });
    };
  };

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
          label={subDefs[index] && subDefs[index].type}
          onChange={_onChange(index)}
          onEnter={onEnter}
          type={subDefs[index]}
          withLabel={withLabel}
        />
      ))}
    </Bare>
  );
}
