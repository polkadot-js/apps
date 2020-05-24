// Copyright 2017-2020 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { Props } from '@polkadot/react-params/types';

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

import Extrinsic from './Extrinsic';

function Call ({ className = '', isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTx } = useApi();

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
      onEscape={onEscape}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Call);
