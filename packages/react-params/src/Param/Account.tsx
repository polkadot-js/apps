// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InputAddress } from '@canvas-ui/react-components';
import React, { useCallback, useState } from 'react';

import keyring from '@polkadot/ui-keyring';

import { Props } from '@canvas-ui/react-components/types';
import Bare from './Bare';

function Account ({ className = '', defaultValue: { value }, isDisabled, isError, isInOption, label, onChange, withLabel }: Props): React.ReactElement<Props> {
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
