// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useCallback, useState } from 'react';
import { InputAddress } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import Bare from './Bare';

function Account ({ className, defaultValue: { value }, isDisabled, isError, label, onChange, style, withLabel }: Props): React.ReactElement<Props> {
  const [defaultValue] = useState(value?.toString());

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
    <Bare
      className={className}
      style={style}
    >
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
