// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

interface Param {
  name?: string;
  type: TypeDef;
}

export default function StructParam (props: Props): React.ReactElement<Props> {
  const [{ defs, params }, setParams] = useState<{ defs: TypeDef[]; params: Param[] }>({ defs: [], params: [] });
  const { className, isDisabled, label, onChange, style, type, withLabel } = props;

  useEffect((): void => {
    const defs = getTypeDef(
      createType(type.type as any).toRawType()
    ).sub as TypeDef[];

    setParams({ defs, params: defs.map((type): Param => ({ name: type.name, type })) });
  }, [type]);

  if (isDisabled) {
    return <Static {...props} />;
  }

  const _onChangeParams = (values: RawParam[]): void => {
    console.log('Struct(onChange)', JSON.stringify(values));

    onChange && onChange({
      isValid: values.reduce((result, { isValid }): boolean => result && isValid, true as boolean),
      value: values.reduce((combo: Record<string, any>, { value }, index): Record<string, any> => {
        combo[defs[index].name as string] = value;

        return combo;
      }, {})
    });
  };

  return (
    <div className='ui--Params-Struct'>
      <Base
        className={className}
        label={label}
        style={style}
        withLabel={withLabel}
      />
      <Params
        onChange={_onChangeParams}
        params={params}
      />
    </div>
  );
}
