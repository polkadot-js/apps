// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Input } from '@polkadot/react-components';

import Bare from './Bare';

function onChange ({ onChange }: Props): (_: string) => void {
  return (value: string): void => {
    const isValid = value.length !== 0;

    onChange && onChange({
      isValid,
      value
    });
  };
}

function getDisplayValue (defaultValue: RawParam | null): string {
  return defaultValue && defaultValue.value
    ? defaultValue.value.toHex
      ? defaultValue.value.toHex()
      : defaultValue.value
    : '';
}

export default function Data (props: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState(getDisplayValue(props.defaultValue));
  const { className, defaultValue, isDisabled, isError, label, onEnter, style, withLabel } = props;

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue);

    if (newValue !== displayValue) {
      setDisplayValue(newValue);
    }
  }, [defaultValue, displayValue]);

  return (
    <Bare
      className={className}
      style={style}
    >
      <Input
        className='full'
        defaultValue={displayValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={onChange(props)}
        onEnter={onEnter}
        placeholder='Hex data'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}
