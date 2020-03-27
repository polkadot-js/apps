// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import BN from 'bn.js';
import React, { useCallback } from 'react';
import { InputBalance } from '@polkadot/react-components';

import Bare from './Bare';

function Balance ({ className, defaultValue: { value }, isDisabled, isError, label, onChange, onEnter, onEscape, style, withLabel }: Props): React.ReactElement<Props> {
  const defaultValue = new BN((value as BN || '0').toString()).toString(10);
  const _onChange = useCallback(
    (value?: BN): void =>
      onChange && onChange({
        isValid: !isError && !!value,
        value
      }),
    [isError]
  );

  return (
    <Bare
      className={className}
      style={style}
    >
      <InputBalance
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={_onChange}
        withEllipsis
        onEnter={onEnter}
        onEscape={onEscape}
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Balance);

export {
  Balance
};
