// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from '@polkadot/ui-react-app/Params/types';

import React from 'react';

import BaseAccount from '../Account';

type Props = BaseProps & {
  defaultValue?: Uint8Array
};

export default function Account ({ className, defaultValue, index, isError, onChange, label, style }: Props): React$Node {
  const _onChange = (value?: Uint8Array): void =>
    onChange(index, {
      isValid: !!value && value.length === 32,
      value
    });

  return (
    <BaseAccount
      className={className}
      defaultValue={defaultValue}
      isError={isError}
      isInput
      label={label}
      onChange={_onChange}
      style={style}
    />
  );
}
