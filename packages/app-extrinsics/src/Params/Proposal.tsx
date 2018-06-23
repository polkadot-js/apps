// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';

import Extrinsic from './Extrinsic';

// @ts-ignore check?
const defaultValue = extrinsics.get('consensus').private.setCode;

export default function Proposal ({ className, isDisabled, isError, label, onChange, style, withLabel }: Props) {
  return (
    <Extrinsic
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate
      label={label}
      onChange={onChange}
      style={style}
      withLabel={withLabel}
    />
  );
}
