// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { TypeDef } from '@polkadot/types/types';
import { Props as BareProps, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Button } from '@polkadot/react-components';
import { isUndefined } from '@polkadot/util';

import translate from '../translate';
import getInitValue from '../initValue';
import Base from './Base';
import findComponent from './findComponent';

interface Props extends BareProps, WithTranslation {}

function Vector ({ className, defaultValue, isDisabled = false, label, onChange, onEnter, style, t, type, withLabel }: Props): React.ReactElement<Props> | null {
  const [Component, setComponent] = useState<React.ComponentType<BareProps> | null>(null);
  const [stateType, setStateType] = useState<string | null>(null);
  const [values, setValues] = useState<RawParam[]>([]);

  useEffect((): void => {
    const value = defaultValue.value || [];

    if (stateType === type.type) {
      return;
    }

    setStateType(type.type);
    setComponent((): React.ComponentType<BareProps> => findComponent(type.sub as TypeDef));
    setValues(
      isDisabled || values.length === 0
        ? value.map((value: any): RawParam => (
          isUndefined(value) || isUndefined(value.isValid)
            ? {
              isValid: !isUndefined(value),
              value
            }
            : value
        ))
        : values
    );
  }, [type]);

  useEffect((): void => {
    onChange && onChange({
      isValid: values.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
      value: values.map(({ value }): any => value)
    });
  }, [values]);

  if (!Component) {
    return null;
  }

  const subType = type.sub as TypeDef;

  const _rowAdd = (): void => {
    const value = getInitValue(subType);

    setValues([...values, {
      isValid: !isUndefined(value),
      value
    }]);
  };
  const _rowRemove = (): void => {
    setValues(values.slice(0, values.length - 1));
  };

  return (
    <Base
      className={className}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      {values.map((value, index): React.ReactNode => (
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
              onChange={
                (value: RawParam): void =>
                  setValues(
                    values.map((svalue, sindex): RawParam =>
                      (sindex === index)
                        ? value
                        : svalue
                    )
                  )
              }
              onEnter={onEnter}
              type={subType}
              withLabel={withLabel}
            />
          )
      ))}
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
    </Base>
  );
}

export default translate(Vector);
