// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics-substrate';

import Extrinsic from './Extrinsic';

const defaultValue = extrinsics.staking.methods.public.transfer;

export default function Call ({ className, isDisabled, isError, index, label, onChange, style, withLabel }: Props): React$Node {
  return (
    <Extrinsic
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={false}
      index={index}
      label={label}
      onChange={onChange}
      style={style}
      withLabel={withLabel}
    />
  );
}
