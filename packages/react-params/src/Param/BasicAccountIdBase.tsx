// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props as BaseProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { InputAddressSimple } from '@polkadot/react-components';
import { isEthereumAddress, validateAddress } from '@polkadot/util-crypto';

import Bare from './Bare.js';

interface Props extends BaseProps {
  bytesLength: 20 | 32;
}

function isValidAddress (value: string | null | undefined, isEthereum: boolean): boolean {
  if (value) {
    try {
      return isEthereum
        ? isEthereumAddress(value)
        : validateAddress(value);
    } catch (err) {
      console.error(err);
    }
  }

  return false;
}

function BasicAccountIdBase (props: Props): React.ReactElement<Props> {
  const { bytesLength, className = '', defaultValue: { value }, isDisabled, isError, label, onChange } = props;
  const [defaultValue] = useState(() => (value as string)?.toString());

  const _onChange = useCallback(
    (value?: string | null) =>
      onChange && onChange({
        isValid: isValidAddress(value, bytesLength === 20),
        value
      }),
    [bytesLength, onChange]
  );

  return (
    <Bare className={className}>
      <InputAddressSimple
        bytesLength={bytesLength}
        className='full'
        defaultValue={defaultValue}
        forceIconType={bytesLength === 20 ? 'ethereum' : 'substrate'}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        noConvert
        onChange={_onChange}
        placeholder={bytesLength === 20 ? '0x1...' : '5...'}
      />
    </Bare>
  );
}

export default React.memo(BasicAccountIdBase);
