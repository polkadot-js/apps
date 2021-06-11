// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props } from '../types';

import React, { useCallback, useState } from 'react';

import { InputAddress } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import Bare from './Bare';

function Account ({ className = '', defaultValue: { value }, isDisabled, isError, isInOption, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const [defaultValue] = useState(() => (value as string)?.toString());

  const _onChange = useCallback(
    (value?: string | null): void => {
      let isValid = false;

      if (value) {
        try {
          keyring.decodeAddress(value);

          isValid = true;
        } catch (err) {
          console.error(err);
        }
      }

      onChange && onChange({
        isValid,
        value
      });
    },
    [onChange]
  );

  return (
    <Bare className={className}>
      <InputAddress
        className='full'
        defaultValue={defaultValue}
        hideAddress={isInOption}
        isDisabled={isDisabled}
        isError={isError}
        isInput
        label={label}
        onChange={_onChange}
        placeholder='5...'
        type='allPlus'
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Account);
