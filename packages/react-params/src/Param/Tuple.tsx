// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ParamDef, Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

export default function Tuple (props: Props): React.ReactElement<Props> {
  const [params, setParams] = useState<ParamDef[]>([]);
  const { className, isDisabled, label, onChange, style, type, withLabel } = props;

  useEffect((): void => {
    const rawType = createType(type.type as any).toRawType();
    const typeDef = getTypeDef(rawType);

    setParams((typeDef.sub as TypeDef[]).map((type): ParamDef => ({ name: type.name, type })));
  }, [type]);

  if (isDisabled) {
    return <Static {...props} />;
  }

  const _onChangeParams = (values: RawParam[]): void => {
    onChange && onChange({
      isValid: values.reduce((result, { isValid }): boolean => result && isValid, true as boolean),
      value: values.map(({ value }): any => value)
    });
  };

  return (
    <div className='ui--Params-Tuple'>
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
