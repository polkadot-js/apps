// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Props } from '../types';

import React, { useCallback, useMemo } from 'react';

import { Input, InputNumber } from '@polkadot/react-components';
import { ClassOf } from '@polkadot/types/create';
import { bnToBn, formatNumber, isUndefined } from '@polkadot/util';

import Bare from './Bare';

function Amount ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, registry, type, withLabel }: Props): React.ReactElement<Props> {
  const defaultValue = useMemo(
    () => isDisabled
      ? value instanceof ClassOf(registry, 'AccountIndex')
        ? value.toString()
        : formatNumber(value as number)
      : bnToBn((value as number) || 0).toString(),
    [isDisabled, registry, value]
  );

  const bitLength = useMemo(
    (): number => {
      try {
        return registry.createType(type.type as 'u32').bitLength();
      } catch (error) {
        return 32;
      }
    },
    [registry, type]
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
            bitLength={bitLength}
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
