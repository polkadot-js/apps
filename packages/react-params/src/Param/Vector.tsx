// Copyright 2017-2022 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParamDef, Props, RawParam } from '../types';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

import getInitValue from '../initValue';
import { useTranslation } from '../translate';
import Params from '../';
import Base from './Base';
import useParamDefs from './useParamDefs';

function generateParam ([{ name, type }]: ParamDef[], index: number): ParamDef {
  return {
    name: `${index}: ${name || type.type}`,
    type
  };
}

function Vector ({ className = '', defaultValue, isDisabled = false, label, onChange, overrides, registry, type, withLabel }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const inputParams = useParamDefs(registry, type);
  const [count, setCount] = useState(0);
  const [params, setParams] = useState<ParamDef[]>([]);
  const [values, setValues] = useState<RawParam[]>([]);

  // build up the list of parameters we are using
  useEffect((): void => {
    if (inputParams.length) {
      const max = isDisabled ? (defaultValue.value as RawParam[] || []).length : count;
      const params: ParamDef[] = [];

      for (let index = 0; index < max; index++) {
        params.push(generateParam(inputParams, index));
      }

      setParams(params);
    }
  }, [count, defaultValue, isDisabled, inputParams]);

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
  }, [count, inputParams, isDisabled, registry]);

  // when isDisabled, set the values based on the defaultValue input
  useEffect((): void => {
    isDisabled &&
      setValues(
        (defaultValue.value as RawParam[] || []).map((value: RawParam) =>
          isUndefined(value) || isUndefined(value.isValid)
            ? { isValid: !isUndefined(value), value }
            : value
        )
      );
  }, [defaultValue, isDisabled]);

  // when our values has changed, alert upstream
  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce((result: boolean, { isValid }) => result && isValid, true),
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
            label={t<string>('Add item')}
            onClick={_rowAdd}
          />
          <Button
            icon='minus'
            isDisabled={values.length === 0}
            label={t<string>('Remove item')}
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
