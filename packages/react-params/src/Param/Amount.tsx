// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '../types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Input } from '@polkadot/react-components';
import { ClassOf } from '@polkadot/types';
import { bnToBn, formatNumber } from '@polkadot/util';

import Bare from './Bare';

function Amount ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, withLabel }: Props): React.ReactElement<Props> {
  const [defaultValue] = useState(
    isDisabled
      ? (
        value instanceof ClassOf(registry, 'AccountIndex')
          ? value.toString()
          : formatNumber(value as number)
      )
      : bnToBn((value as number) || 0).toString()
  );

  const _onChange = useCallback(
    (value: string) =>
      onChange && onChange({
        isValid: true,
        value: new BN(value || 0)
      }),
    [onChange]
  );

  return (
    <Bare className={className}>
      <Input
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        min={0}
        onChange={_onChange}
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

export default React.memo(Amount);
