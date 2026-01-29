// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParamDef, Props, RawParam } from '../types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

import Params from '../index.js';
import getInitValue from '../initValue.js';
import { useTranslation } from '../translate.js';
import Base from './Base.js';
import useParamDefs from './useParamDefs.js';

function getParam ([{ name, type }]: ParamDef[], index: number): ParamDef {
  return {
    name: `${index}: ${name || type.type}`,
    type
  };
}

export function getParams (inputParams: ParamDef[], prev: ParamDef[], max: number): ParamDef[] {
  if (prev.length === max) {
    return prev;
  }

  const params: ParamDef[] = [];

  for (let index = 0; index < max; index++) {
    params.push(getParam(inputParams, index));
  }

  return params;
}

export function getValues ({ value }: RawParam): RawParam[] {
  if (value instanceof Set) {
    value = [...value.values()];
  }

  return Array.isArray(value)
    ? value.map((value: RawParam) =>
      isUndefined(value) || isUndefined(value.isValid)
        ? { isValid: !isUndefined(value), value }
        : value
    )
    : [];
}

function Vector ({ className = '', defaultValue, isDisabled = false, label, onChange, overrides, registry, type, withLabel }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const inputParams = useParamDefs(registry, type);
  const [values, setValues] = useState<RawParam[]>(() => getValues(defaultValue));
  const [count, setCount] = useState(() => values.length);
  const [params, setParams] = useState<ParamDef[]>(() => getParams(inputParams, [], count));

  // build up the list of parameters we are using
  useEffect((): void => {
    inputParams.length &&
      setParams((prev) =>
        getParams(inputParams, prev, isDisabled ? values.length : count)
      );
  }, [count, values, isDisabled, inputParams]);

  // when !isDisable, generating an input list based on count
  useEffect((): void => {
    !isDisabled && inputParams.length &&
      setValues((values): RawParam[] => {
        if (values.length === count) {
          return values;
        }

        while (values.length < count) {
          const value = getInitValue(registry, inputParams[0].type);

          values.push({ isValid: !isUndefined(value), value });
        }

        return values.slice(0, count);
      });
  }, [count, defaultValue, inputParams, isDisabled, registry]);

  // when our values has changed, alert upstream
  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce<boolean>((result, { isValid }) => result && isValid, true),
      value: values.map(({ value }) => value)
    });
  }, [values, onChange]);

  const _rowAdd = useCallback(
    (): void => setCount((count) => count + 1),
    []
  );
  const _rowRemove = useCallback(
    (): void => setCount((count) => count - 1),
    []
  );

  return (
    <Base
      className={className}
      isOuter
      label={label}
      withLabel={withLabel}
    >
      {!isDisabled && (
        <div className='ui--Param-Vector-buttons'>
          <Button
            icon='plus'
            label={t('Add item')}
            onClick={_rowAdd}
          />
          <Button
            icon='minus'
            isDisabled={values.length === 0}
            label={t('Remove item')}
            onClick={_rowRemove}
          />
        </div>
      )}
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

export default React.memo(Vector);
