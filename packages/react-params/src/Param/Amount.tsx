// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { ClassOf } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { bnToBn, formatNumber } from '@polkadot/util';

import Bare from './Bare';

function onChange ({ onChange }: Props): (_: string) => void {
  return (value: string): void => {
    onChange && onChange({
      isValid: true,
      value: new BN(value || 0)
    });
  };
}

function getDisplayValue (defaultValue: RawParam | null, isDisabled?: boolean): string {
  return isDisabled && defaultValue
    ? (
      defaultValue.value instanceof ClassOf('AccountIndex')
        ? defaultValue.value.toString()
        : formatNumber(defaultValue.value)
    )
    : defaultValue
      ? bnToBn((defaultValue.value as number) || 0).toString()
      : '0';
}

export default function Amount (props: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState(getDisplayValue(props.defaultValue, props.isDisabled));
  const { className, defaultValue, isDisabled, isError, label, onEnter, style, withLabel } = props;

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue, isDisabled);

    if (displayValue !== newValue) {
      setDisplayValue(newValue);
    }
  }, [defaultValue, displayValue, isDisabled]);

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
        min={0}
        onChange={onChange(props)}
        onEnter={onEnter}
        type={
          isDisabled
            ? 'text'
            : 'number'
        }
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}
