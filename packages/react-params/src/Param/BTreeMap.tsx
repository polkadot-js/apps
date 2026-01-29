// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParamDef, Props, RawParam } from '../types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@polkadot/react-components';
import { BTreeMap } from '@polkadot/types';
import { isCodec, isUndefined } from '@polkadot/util';

import Params from '../index.js';
import getInitValue from '../initValue.js';
import { useTranslation } from '../translate.js';
import Base from './Base.js';
import useParamDefs from './useParamDefs.js';

function getParamType ([key, value]: ParamDef[]): ParamDef[] {
  return [{
    name: '(Key, Value)',
    type: {
      info: 17,
      sub: [key.type, value.type],
      type: `(${key.type.type}, ${value.type.type})`
    }
  }];
}

function getParam ([{ name, type }]: ParamDef[], index: number): ParamDef {
  return {
    name: `${index}: ${name || type.type}`,
    type
  };
}

export function getParams (keyValueParam: ParamDef[], prev: ParamDef[], max: number): ParamDef[] {
  if (prev.length === max) {
    return prev;
  }

  const params: ParamDef[] = [];

  for (let index = 0; index < max; index++) {
    params.push(getParam(keyValueParam, index));
  }

  return params;
}

export function getValues ({ isValid, value }: RawParam): RawParam[] {
  return (isValid && isCodec(value) && value instanceof BTreeMap)
    ? [...value.entries()].map(([key, value]: RawParam[]) => {
      return {
        isValid: true,
        value: [{ isValid: true, value: key }, { isValid: true, value }]
      };
    })
    : [];
}

function BTreeMapParam ({ className = '', defaultValue, isDisabled = false, label, onChange, overrides, registry, type, withLabel }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const keyValueParam = getParamType(useParamDefs(registry, type));
  const [values, setValues] = useState<RawParam[]>(() => getValues(defaultValue));
  const [count, setCount] = useState(() => values.length);
  const [params, setParams] = useState<ParamDef[]>(() => getParams(keyValueParam, [], count));

  // build up the list of parameters we are using
  useEffect((): void => {
    keyValueParam.length &&
      setParams((prev) =>
        getParams(keyValueParam, prev, isDisabled ? values.length : count)
      );
  }, [count, values, isDisabled, keyValueParam]);

  // when !isDisable, generating an input list based on count
  useEffect((): void => {
    !isDisabled && keyValueParam.length &&
      setValues((values): RawParam[] => {
        if (values.length === count) {
          return values;
        }

        while (values.length < count) {
          const value = getInitValue(registry, keyValueParam[0].type);

          values.push({ isValid: !isUndefined(value), value });
        }

        return values.slice(0, count);
      });
  }, [count, defaultValue, keyValueParam, isDisabled, registry]);

  // when our values has changed, alert upstream
  useEffect((): void => {
    const output = new Map();
    let isValid = true;

    for (const entry of values) {
      const [key, value] = entry.value as RawParam[];

      if (output.has(key)) {
        isValid = false;
        console.error('BTreeMap: Duplicate key ', key);
      }

      output.set(key, value);
      isValid = isValid && entry.isValid;
    }

    onChange && onChange({
      isValid,
      value: output
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
        <div className='ui--Param-BTreeMap-buttons'>
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

export default React.memo(BTreeMapParam);
