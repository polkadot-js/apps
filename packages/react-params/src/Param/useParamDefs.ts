// Copyright 2017-2020 @polkadot/react-params authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ParamDef } from '../types';

import { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { getTypeDef } from '@polkadot/types';

function expandDef (td: TypeDef): TypeDef {
  try {
    return getTypeDef(
      registry.createType(td.type as 'u32').toRawType()
    );
  } catch (e) {
    return td;
  }
}

export default function useParamDefs (type: TypeDef): ParamDef[] {
  const [params, setParams] = useState<ParamDef[]>([]);

  useEffect((): void => {
    const typeDef = expandDef(type);

    if (!typeDef.sub) {
      return setParams([]);
    }

    setParams(
      (Array.isArray(typeDef.sub) ? typeDef.sub : [typeDef.sub]).map((td): ParamDef => ({
        length: typeDef.length,
        name: td.name,
        type: td // expandDef(td)
      }))
    );
  }, [type]);

  return params;
}
