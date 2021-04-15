// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry } from '@canvas-ui/react-api';
import { Input, InputNumber } from '@canvas-ui/react-components';
import { Props } from '@canvas-ui/react-components/types';
import BN from 'bn.js';
import React, { useCallback, useMemo } from 'react';

import { ClassOf } from '@polkadot/types';
import { bnToBn, formatNumber, isUndefined } from '@polkadot/util';

import Bare from './Bare';

function Amount ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, type, withLabel }: Props): React.ReactElement<Props> {
  const defaultValue = useMemo(
    () => isDisabled
      ? value instanceof ClassOf(registry, 'AccountIndex')
        ? value.toString()
        : formatNumber(value as number)
      : bnToBn((value as number) || 0).toString(),
    [isDisabled, value]
  );

  const bitLength = useMemo(
    (): number => {
      try {
        return registry.createType(type.type as 'u32').bitLength();
      } catch (error) {
        return 32;
      }
    },
    [type]
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
