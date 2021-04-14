// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { TypeDef } from '@polkadot/types/types';

import { RawParams, UseTxParamsHook } from '../types';
import createValues from './values';

export default function useTxParams (source: { type: TypeDef }[]): UseTxParamsHook {
  const [params, setParams] = useState(source);
  const [values, setValues] = useState<RawParams>(createValues(params));

  useEffect((): void => {
    setParams(source);
    setValues(createValues(source));
  }, [source]);

  return [params, values, setValues];
}
