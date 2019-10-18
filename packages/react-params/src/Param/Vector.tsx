// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { TypeDef } from '@polkadot/types/types';
import { ParamDef, Props as BareProps, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Button } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';
import getInitValue from '../initValue';
import Params from '../';
import Base from './Base';

interface Props extends BareProps, WithTranslation {}

function Vector ({ className, defaultValue, isDisabled = false, label, onChange, style, t, type, withLabel }: Props): React.ReactElement<Props> | null {
  const [count, setCount] = useState(1);
  const [params, setParams] = useState<ParamDef[]>([]);
  const [values, setValues] = useState<RawParam[]>([]);

  //
  useEffect((): void => {
    const subType = type.sub as TypeDef;
    const params: ParamDef[] = [];
    const param: ParamDef = { name: subType.name, type: subType };

    for (let i = 0; i < count; i++) {
      params.push({ ...param })
    }

    setParams(params);
  }, [count, type]);

  // set the values based on the count - assuming we are entering info
  useEffect((): void => {
    if (!isDisabled && values.length !== count) {
      while (values.length < count) {
        const value = getInitValue(type.sub as TypeDef);

        values.push({ isValid: !isUndefined(value), value });
      }

      setValues(values.slice(0, count));
    }
  }, [count, isDisabled, type, values]);

  // set the values based on the defaultValue input
  useEffect((): void => {
    if (isDisabled) {
      setValues(
        defaultValue.value || [].map((value: any): RawParam => (
          isUndefined(value) || isUndefined(value.isValid)
            ? {
              isValid: !isUndefined(value),
              value
            }
            : value
        ))
      );
    }
  }, [defaultValue, isDisabled]);

  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
      value: values.map(({ value }): any => value)
    });
  }, [values]);

  const _rowAdd = (): void => setCount(count + 1);
  const _rowRemove = (): void => setCount(count - 1);

  return (
    <Base
      className={className}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      {!isDisabled && (
        <div className='ui--Param-Vector-buttons'>
          <Button
            isPrimary
            onClick={_rowAdd}
            label={t('Add item')}
            icon='add'
          />
          <Button
            isDisabled={values.length === 1}
            isNegative
            onClick={_rowRemove}
            label={t('Remove item')}
            icon='minus'
          />
        </div>
      )}
      <Params
        isDisabled={isDisabled}
        onChange={setValues}
        params={params}
        values={values}
      />
      {/* {values.map((value, index): React.ReactNode => (
        // FIXME? This doesn't look quite right - this means that any bool would disappear
        // when set to false? At the very least need an explanation here
        type.type === 'Vec<bool>' && isDisabled && values[index].value === false
          ? null
          : (
            <Component
              defaultValue={value}
              isDisabled={isDisabled}
              key={index}
              label={`${index}: ${subType.type}`}
              onChange={(value: RawParam): void => _onChange(index, value)}
              onEnter={onEnter}
              type={subType}
              withLabel={withLabel}
            />
          )
      ))} */}
    </Base>
  );
}

export default translate(Vector);
