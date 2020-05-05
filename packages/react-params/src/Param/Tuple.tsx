// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ParamDef, Props, RawParam } from '../types';

import React, { useCallback, useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

function Tuple (props: Props): React.ReactElement<Props> {
  const [params, setParams] = useState<ParamDef[]>([]);
  const { className, isDisabled, label, onChange, overrides, style, type, withLabel } = props;

  useEffect((): void => {
    try {
      const rawType = createType(registry, type.type as any).toRawType();
      const typeDef = getTypeDef(rawType);

      setParams((typeDef.sub as TypeDef[]).map((type): ParamDef => ({ name: type.name, type })));
    } catch (e) {
      setParams(((Array.isArray(type.sub) ? type.sub : [type.sub]) as TypeDef[]).map((subType): ParamDef => ({ name: subType.name, type: subType })));
    }
  }, [type]);

  const _onChangeParams = useCallback(
    (values: RawParam[]): void => {
      onChange && onChange({
        isValid: values.reduce((result, { isValid }): boolean => result && isValid, true as boolean),
        value: values.map(({ value }): any => value)
      });
    },
    [onChange]
  );

  if (isDisabled) {
    return <Static {...props} />;
  }

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
        overrides={overrides}
        params={params}
      />
    </div>
  );
}

export default React.memo(Tuple);
