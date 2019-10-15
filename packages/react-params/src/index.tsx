// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParamOnChangeValue } from './types';

import './Params.css';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

import ParamComp from './ParamComp';
import translate from './translate';
import { createValue } from './values';

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParam[]) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  params: ParamDef[];
  values?: RawParam[] | null;
}

function Params ({ className, isDisabled, onChange, onEnter, overrides, params, style, values: propValues }: Props): React.ReactElement<Props> | null {
  const [values, setValues] = useState<RawParam[]>([]);

  useEffect((): void => {
    setValues(
      params.map((param, index): RawParam =>
        propValues && propValues[index]
          ? propValues[index]
          : createValue(param)
      )
    );
  }, [params, propValues]);

  useEffect((): void => {
    onChange && onChange(values);
  }, [values]);

  if (params.length === 0) {
    return null;
  }

  const _onChange = (index: number, value: RawParamOnChangeValue): void => {
    console.log('Params(onChange)', index, JSON.stringify(value));
    setValues(
      values.map((prev, prevIndex): RawParam =>
        index !== prevIndex
          ? prev
          : { isValid: false, ...value }
      )
    );
  };

  return (
    <div
      className={classes('ui--Params', className)}
      style={style}
    >
      <div className='ui--Params-Content'>
        {params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
          <ParamComp
            defaultValue={
              isDisabled
                ? values[index]
                : null
            }
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
