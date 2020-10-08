// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '../types';

import React, { useCallback, useState } from 'react';
import { InputAddress } from '@canvas-ui/react-components';
import keyring from '@polkadot/ui-keyring';

import Bare from './Bare';

function Account ({ className = '', defaultValue: { value }, isDisabled, isError, label, onChange, withLabel }: Props): React.ReactElement<Props> {
  const [defaultValue] = useState((value as string)?.toString());

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
