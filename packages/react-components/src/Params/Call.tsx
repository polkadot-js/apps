// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { Props } from '@polkadot/react-params/types';

import React from 'react';
import { useApiContext } from '@polkadot/react-hooks';

import Extrinsic from './Extrinsic';

export default function Call ({ className, isDisabled, isError, label, onChange, onEnter, style, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTx } = useApiContext();

  const defaultValue = ((): SubmittableExtrinsicFunction<'promise'> => {
    try {
      return api.tx.balances.transfer;
    } catch (error) {
      return apiDefaultTx;
    }
  })();

  return (
    <Extrinsic
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isPrivate={false}
      label={label}
      onChange={onChange}
      onEnter={onEnter}
      style={style}
      withLabel={withLabel}
    />
  );
}
