// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Input } from '@polkadot/react-components';

import Bare from './Bare.js';

function Text ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const [isValid, setIsValid] = useState(false);

  const _onChange = useCallback(
    (value: string): void => {
      const isValid = value.length !== 0;

      onChange && onChange({
        isValid,
        value
      });
      setIsValid(isValid);
    },
    [onChange]
  );

  const defaultValue = (value as string || '').toString();

  return (
    <Bare className={className}>
      <Input
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError || !isValid}
        label={label}
        onChange={_onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder='<any string>'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Text);
