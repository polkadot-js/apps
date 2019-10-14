// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { GenericVote } from '@polkadot/types';
import { Dropdown } from '@polkadot/react-components';

import Bare from './Bare';

const options = [
  { text: 'Nay', value: 0 },
  { text: 'Aye', value: -1 }
];

function onChange ({ onChange }: Props): (_: number) => void {
  return function (value: number): void {
    onChange && onChange({
      isValid: true,
      value
    });
  };
}

function getDisplayValue (defaultValue: RawParam | null): number {
  return defaultValue && defaultValue.value
    ? defaultValue.value instanceof BN
      ? defaultValue.value.toNumber()
      : defaultValue.value instanceof GenericVote
        ? (defaultValue.value.isAye ? -1 : 0)
        : defaultValue.value as number
    : 0;
}

export default function Vote (props: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState(getDisplayValue(props.defaultValue));
  const { className, defaultValue, isDisabled, isError, label, style, withLabel } = props;

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
      <Dropdown
        className='full'
        defaultValue={displayValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        options={options}
        onChange={onChange(props)}
        withLabel={withLabel}
      />
    </Bare>
  );
}
