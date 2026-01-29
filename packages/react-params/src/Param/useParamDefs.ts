// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { ParamDef } from '../types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';
import { getTypeDef } from '@polkadot/types/create';

function expandDef (registry: Registry, td: TypeDef): TypeDef {
  try {
    return getTypeDef(
      registry.createType(td.type as 'u32').toRawType()
    );
  } catch {
    return td;
  }
}

function getDefs (registry: Registry, type: TypeDef): ParamDef[] {
  const typeDef = expandDef(registry, type);

  return typeDef.sub
    ? (Array.isArray(typeDef.sub) ? typeDef.sub : [typeDef.sub]).map((td): ParamDef => ({
      length: typeDef.length,
      name: td.name,
      type: td
    }))
    : [];
}

function useParamDefsImpl (registry: Registry, type: TypeDef): ParamDef[] {
  return useMemo(
    () => getDefs(registry, type),
    [registry, type]
  );
}

export default createNamedHook('useParamDefs', useParamDefsImpl);
