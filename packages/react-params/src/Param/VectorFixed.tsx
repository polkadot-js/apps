// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParamDef, Props, RawParam } from '../types.js';

import React, { useEffect, useState } from 'react';

import { VecFixed } from '@polkadot/types';
import { isUndefined } from '@polkadot/util';

import Params from '../index.js';
import getInitValue from '../initValue.js';
import Base from './Base.js';
import useParamDefs from './useParamDefs.js';
import { getParams, getValues } from './Vector.js';

function getInitialValues (defaultValue: RawParam): RawParam[] {
  return defaultValue.value instanceof VecFixed
    ? defaultValue.value.map((value) => ({ isValid: true, value: value as unknown }))
    : getValues(defaultValue);
}

function VectorFixed ({ className = '', defaultValue, isDisabled = false, label, onChange, overrides, registry, type, withLabel }: Props): React.ReactElement<Props> | null {
  const inputParams = useParamDefs(registry, type);
  const [params] = useState<ParamDef[]>(() => getParams(inputParams, [], (inputParams[0].length || 1)));
  const [values, setValues] = useState<RawParam[]>(() => getInitialValues(defaultValue));

  // when !isDisable, generating an input list based on count
  useEffect((): void => {
    !isDisabled && inputParams.length &&
      setValues((values): RawParam[] => {
        const count = (inputParams[0].length || 1);

        if (values.length === count) {
          return values;
        }

        while (values.length < count) {
          const value = getInitValue(registry, inputParams[0].type);

          values.push({ isValid: !isUndefined(value), value });
        }

        return values.slice(0, count);
      });
  }, [inputParams, isDisabled, registry]);

  // when our values has changed, alert upstream
  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce((result: boolean, { isValid }) => result && isValid, true),
      value: values.map(({ value }) => value)
    });
  }, [values, onChange]);

  return (
    <Base
      className={className}
      isOuter
      label={label}
      withLabel={withLabel}
    >
      <Params
        isDisabled={isDisabled}
        onChange={setValues}
        overrides={overrides}
        params={params}
        registry={registry}
        values={values}
      />
    </Base>
  );
}

export default React.memo(VectorFixed);
