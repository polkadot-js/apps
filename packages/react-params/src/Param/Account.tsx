// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MultiAddress } from '@polkadot/types/interfaces';
import type { Props } from '../types.js';

import React, { useCallback, useState } from 'react';

import { InputAddress } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import Bare from './Bare.js';
import Enum from './Enum.js';

function isValidAddress (value?: string | null): boolean {
  if (value) {
    try {
      keyring.decodeAddress(value);

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  return false;
}

function Account (props: Props): React.ReactElement<Props> {
  const { className = '', defaultValue: { value }, isDisabled, isError, label, onChange, type, withLabel } = props;
  const [defaultValue] = useState(() => (value as string)?.toString());

  const _onChange = useCallback(
    (value?: string | null) =>
      onChange && onChange({
        isValid: isValidAddress(value),
        value
      }),
    [onChange]
  );

  // special handling for MultiAddress
  if (type.type === 'MultiAddress') {
    if (!isDisabled || !value || (value as MultiAddress).type !== 'Id') {
      return <Enum {...props} />;
    }
  }

  return (
    <Bare className={className}>
      <InputAddress
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isInput
        label={label}
        onChange={_onChange}
        placeholder='5GLFK...'
        type='allPlus'
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Account);
