// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';

import Extrinsic from './Extrinsic';

const defaultValue = extrinsics.staking.public.transfer;

export default function Call ({ className, isDisabled, isError, label, onChange, style, withLabel }: Props): React$Node {
  return (
    <Extrinsic
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={false}
      label={label}
      onChange={onChange}
      style={style}
      withLabel={withLabel}
    />
  );
}
