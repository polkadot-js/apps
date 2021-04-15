// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry } from '@canvas-ui/react-api';
import { Dropdown } from '@canvas-ui/react-components';
import { Props } from '@canvas-ui/react-components/types';
import React, { useCallback } from 'react';

import { ClassOf } from '@polkadot/types';
import { bnToBn } from '@polkadot/util';

import Bare from './Bare';

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 }
];

function VoteThresholdParam ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: number) =>
      onChange && onChange({
        isValid: true,
        value
      }),
    [onChange]
  );

  const defaultValue = value instanceof ClassOf(registry, 'VoteThreshold')
    ? value.toNumber()
    : bnToBn(value as number).toNumber();

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
