// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeDef } from '@polkadot/types/types';
import { RawParams, UseTxParamsHook } from './types';

import { useEffect, useState } from 'react';
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
