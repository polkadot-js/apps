// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeDef } from '@polkadot/types/types';
import { ParamDef, RawParams, UseTxParams, UseTxParamsHook } from './types';

import BN from 'bn.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BN_ZERO } from '@polkadot/util';
import createValues, { createValue } from './values';

// function mergeValues (params: ParamDef[], prevValues: RawParams = [], prevParams: ParamDef[] = []): RawParams {
//   return params.map((param, index) => {
//     if (prevParams[index] && prevParams[index].type === param.type && prevValues[index].isValid) {
//       return prevValues[index];
//     }

//     return createValue(param);
//   });
// }

// for a given call, calculate the weight
export default function useParams (source: { type: TypeDef }[]): UseTxParamsHook {
  const [params, setParams] = useState(source);
  const [values, setValues] = useState<RawParams>(createValues(params));

  useEffect((): void => {
    setParams(source);
    setValues(createValues(source));
  }, [source]);

  // const mergeValues = useCallback(
  //   (newParams: ParamDef[]): RawParams => {
  //     return newParams.map((param, index) => {
  //       console.log(params[index], param);
  //       if (params[index] && params[index].type === param.type && values[index].isValid) {
  //         console.log('Keep value')
  //         return values[index];
  //       }

  //       console.log('Default value')
  //       return createValue(param);
  //     });
  //   },
  //   [params, values]
  // );

  // useEffect(
  //   (): void => {
  //     console.log(params, prevParams.current)

  //     if (params !== prevParams.current) {
  //       console.log('has changed!');
  //       setValues(mergeValues(params));
  //     }
  //   },
  //   [params, mergeValues]
  // );

  // useEffect((): void => {
  //   prevParams.current = params;
  // });

  return [params, values, setValues];
}
