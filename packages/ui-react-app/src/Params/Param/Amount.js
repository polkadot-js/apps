// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off,sketchy-null-number:off

import type { Props } from '../types';

import BN from 'bn.js';
import React from 'react';
import Input from 'semantic-ui-react/dist/es/elements/Input';

import Base from './Base';

export default function Amount ({ index, isError, label, onChange, t, value: { options: { initValue = 0, maxValue, minValue = 0 } = {} } }: Props): React$Node {
  // eslint-disable-next-line no-unused-vars
  const _onChange = (event: SyntheticEvent<*>, { value }) =>
    onChange(index, {
      isValid: true,
      value: new BN(value || minValue || 0)
    });

  return (
    <Base
      label={label}
      size='small'
    >
      <Input
        defaultValue={initValue || minValue}
        error={isError}
        max={maxValue}
        min={minValue}
        onChange={_onChange}
        type='number'
      />
    </Base>
  );
}
