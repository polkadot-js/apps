// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { ParamDef, Props, RawParam } from '../types';

import { useState } from 'react';

export default function useParamDefs (type: TypeDef): ParamDef[] {
  const [params, setParams] = useState<ParamDef[]>([]);

  return params;
}
