// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';

import Extrinsic from './Extrinsic';

const defaultValue = extrinsics.consensus.private.setCode;

export default function Proposal ({ className, isDisabled, isError, label, onChange, style, withLabel }: Props): React$Node {
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
