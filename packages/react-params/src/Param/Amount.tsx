// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '../types';

import BN from 'bn.js';
import React, { useCallback, useMemo } from 'react';
import { registry } from '@polkadot/react-api';
import { Input, InputNumber } from '@polkadot/react-components';
import { ClassOf } from '@polkadot/types';
import { bnToBn, formatNumber, isUndefined } from '@polkadot/util';

import Bare from './Bare';

function Amount ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, withLabel }: Props): React.ReactElement<Props> {
  const defaultValue = useMemo(
    () => isDisabled
      ? value instanceof ClassOf(registry, 'AccountIndex')
        ? value.toString()
        : formatNumber(value as number)
      : bnToBn((value as number) || 0).toString(),
    [isDisabled, value]
  );

  const _onChange = useCallback(
    (value?: BN) => onChange && onChange({
      isValid: !isUndefined(value),
      value
    }),
    [onChange]
  );

  return (
    <Bare className={className}>
      {isDisabled
        ? (
          <Input
            className='full'
            defaultValue={defaultValue}
            isDisabled
            label={label}
            withEllipsis
            withLabel={withLabel}
          />
        )
        : (
          <InputNumber
            className='full'
            defaultValue={defaultValue}
            isError={isError}
            isZeroable
            label={label}
            onChange={_onChange}
            onEnter={onEnter}
            withLabel={withLabel}
          />
        )
      }
    </Bare>
  );
}

export default React.memo(Amount);
