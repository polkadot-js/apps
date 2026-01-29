// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Props } from '../types.js';

import React, { useCallback, useMemo } from 'react';

import { Dropdown } from '@polkadot/react-components';
import { bnToBn, isFunction } from '@polkadot/util';

import Bare from './Bare.js';

type TextMap = Record<number, string>;

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 }
];

export const textMap = options.reduce((textMap, { text, value }): TextMap => {
  textMap[value] = text;

  return textMap;
}, {} as unknown as TextMap);

function VoteThresholdParam ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: number) =>
      onChange && onChange({
        isValid: true,
        value
      }),
    [onChange]
  );

  const defaultValue = useMemo(
    // eslint-disable-next-line @typescript-eslint/unbound-method
    () => isFunction((value as BN).toNumber)
      ? (value as BN).toNumber()
      : bnToBn(value as number).toNumber(),
    [value]
  );

  return (
    <Bare className={className}>
      <Dropdown
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        options={options}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(VoteThresholdParam);
