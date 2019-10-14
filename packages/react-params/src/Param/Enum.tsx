// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

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

export default function EnumParam (props: Props): React.ReactElement<Props> {
  const [current, setCurrent] = useState<TypeDef | null>(null);
  const [{ options, subDefs }, setOptions] = useState<{ options: Option[]; subDefs: TypeDef[] }>({ options: [], subDefs: [] });
  const { className, defaultValue, isDisabled, isError, label, onChange, style, type, withLabel } = props;

  useEffect((): void => {
    const rawType = createType(type.type as any).toRawType();
    const typeDef = getTypeDef(rawType);

    // HACK This is a quick hack to allow `Option<struct>` ... this is certainly not the right
    // place for this, so we need to move it (even the detection just sucks)... also see struct
    const subDefs = typeDef.type.startsWith('Option<')
      ? (typeDef.sub as TypeDef).sub as TypeDef[]
      : typeDef.sub as TypeDef[];

    setOptions({
      options: subDefs.map(({ name }): Option => ({
        text: name,
        value: name
      })),
      subDefs
    });
    setCurrent(subDefs[0]);
  }, [type]);

  if (isDisabled) {
    return <Static {...props} />;
  }

  const _onChange = (value: string): void =>
    setCurrent(subDefs.find(({ name }): boolean => name === value) || null);

  const _onChangeParam = ([{ isValid, value }]: RawParam[]): void => {
    current && onChange && onChange({
      isValid,
      value: {
        [current.name as string]: value
      }
    });
  }

  return (
    <Bare
      className={className}
      style={style}
    >
      <Dropdown
        className='full'
        defaultValue={
          defaultValue && defaultValue.value
            ? defaultValue.value instanceof Enum
              ? defaultValue.value.type
              : Object.keys(defaultValue.value)[0]
            : defaultValue
        }
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        options={options}
        onChange={_onChange}
        withEllipsis
        withLabel={withLabel}
      />
      {current && (
        <Params
          onChange={_onChangeParam}
          params={[{ name: current.name, type: current }]}
        />
      )}
    </Bare>
  );
}
