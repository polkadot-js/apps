// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { InputBalance } from '@polkadot/react-components';

import Bare from './Bare';

function getDisplayValue (defaultValue: RawParam | null): string {
  return defaultValue && defaultValue.value
    ? new BN((defaultValue.value as BN || '0').toString()).toString(10)
    : '0';
}

export default function Balance ({ className, defaultValue, isDisabled, isError, label, onChange, onEnter, style, withLabel }: Props): React.ReactElement<Props> {
  const [displayValue, setDisplayValue] = useState(getDisplayValue(defaultValue));

  useEffect((): void => {
    const newValue = getDisplayValue(defaultValue);

    if (displayValue !== newValue) {
      setDisplayValue(newValue);
    }
  }, [defaultValue, displayValue]);

  const _onChange = (value?: BN): void => {
    onChange && onChange({
      isValid: !isError && !!value,
      value
    });
  };

  return (
    <Bare
      className={className}
      style={style}
    >
      <InputBalance
        className='full'
        defaultValue={displayValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        withEllipsis
        onEnter={onEnter}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export {
  Balance
};
