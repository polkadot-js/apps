// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue } from './types';

import './Params.css';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

import ParamComp from './ParamComp';
import translate from './translate';
import { createValue } from './values';

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  params: ParamDef[];
  values?: RawParams | null;
}

function Params ({ className, isDisabled, onChange, onEnter, overrides, params, style, values: propValues }: Props): React.ReactElement<Props> | null {
  const [values, setValues] = useState<RawParams>([]);

  useEffect((): void => {
    const newValues = params.map((param, index): RawParam =>
      propValues && propValues[index]
        ? propValues[index]
        : createValue(param)
    );

    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      setValues(newValues);
    }
  }, [params, propValues, values]);

  useEffect((): void => {
    onChange && onChange(values);
  }, [values]);

  if (values.length === 0) {
    return null;
  }

  const _onChange = (index: number, { isValid = false, value }: RawParamOnChangeValue): void => {
    const newValue = { isValid, value };

    if (JSON.stringify(values[index]) !== JSON.stringify(newValue)) {
      setValues(values.map((prev, prevIndex): RawParam =>
        index !== prevIndex
          ? prev
          : newValue
      ));
    }
  };

  return (
    <div
      className={classes('ui--Params', className)}
      style={style}
    >
      <div className='ui--Params-Content'>
        {params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
          <ParamComp
            defaultValue={values[index]}
            index={index}
            isDisabled={isDisabled}
            key={`${name}:${type}:${index}`}
            name={name}
            onChange={_onChange}
            onEnter={onEnter}
            overrides={overrides}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}

export default translate(
  styled(Params)`
    .ui--Param-composite {
      position: relative;

      .ui--Param-overlay {
        position: absolute;
        top: 0.5rem;
        right: 3.5rem;
      }
    }
  `
);
