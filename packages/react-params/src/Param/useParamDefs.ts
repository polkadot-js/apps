// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ParamDef } from '../types';

import { useEffect, useState } from 'react';

import { getTypeDef } from '@polkadot/types/create';

function expandDef (registry: Registry, td: TypeDef): TypeDef {
  try {
    return getTypeDef(
      registry.createType(td.type as 'u32').toRawType()
    );
  } catch (e) {
    return td;
  }
}

export default function useParamDefs (registry: Registry, type: TypeDef): ParamDef[] {
  const [params, setParams] = useState<ParamDef[]>([]);

  useEffect((): void => {
    const typeDef = expandDef(registry, type);

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
  }, [registry, type]);

  return params;
}
