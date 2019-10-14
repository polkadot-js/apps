// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import React, { useEffect, useState } from 'react';
import { Dropdown } from '@polkadot/react-components';

import Bare from './Bare';

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

function onChange ({ onChange }: Props): (_: boolean) => void {
  return function (value: boolean): void {
    onChange && onChange({
      isValid: true,
      value
    });
  };
}

function getDisplayValue (defaultValue: RawParam | null): boolean {
  return defaultValue
    ? defaultValue.value instanceof Boolean
      ? defaultValue.value.valueOf()
      : (defaultValue.value as boolean) || false
    : false;
}

export default function BoolParam (props: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState(getDisplayValue(props.defaultValue));
  const { className, defaultValue, isDisabled, isError, label, style, withLabel } = props;

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue);

    if (newValue !== displayValue) {
      setDisplayValue(newValue);
    }
  }, [displayValue, defaultValue]);

  return (
    <Bare
      className={className}
      style={style}
    >
      <Dropdown
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        options={options}
        onChange={onChange(props)}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}
