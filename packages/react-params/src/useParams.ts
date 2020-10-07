// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeDef } from '@polkadot/types/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue } from './types';

import BN from 'bn.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BN_ZERO } from '@polkadot/util';
import createValues, { createValue } from './values';

export interface UseParams {
  params: ParamDef[],
  values: RawParams,
  onChange: React.Dispatch<RawParams>
}

// function mergeValues (params: ParamDef[], prevValues: RawParams = [], prevParams: ParamDef[] = []): RawParams {
//   return params.map((param, index) => {
//     if (prevParams[index] && prevParams[index].type === param.type && prevValues[index].isValid) {
//       return prevValues[index];
//     }

//     return createValue(param);
//   });
// }

// for a given call, calculate the weight
export default function useParams (source: { type: TypeDef }[]): UseParams {
  const params = useMemo(
    (): ParamDef[] => {
      return source as ParamDef[];
    },
    [source]
  );

  const prevParams = useRef(params);

  useEffect((): void => {
    prevParams.current = params;
  }, [params]);

  const [values, setValues] = useState<RawParams>(createValues(params));

  const mergeValues = useCallback(
    (newParams: ParamDef[]): RawParams => {
      return newParams.map((param, index) => {
        if (params[index] && params[index].type === param.type && values[index].isValid) {
          return values[index];
        }

        return createValue(param);
      });
    },
    [params, values]
  );

  useEffect(
    (): void => {
      if (params !== prevParams.current) {
        setValues(mergeValues(params));
      }
    },
    [params, mergeValues]
  );

  return { params, setValues, values };
}
