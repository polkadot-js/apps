// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Props } from '@polkadot/react-params/types';

import React, { useState } from 'react';

import { useApi } from '@polkadot/react-hooks';

import Extrinsic from './Extrinsic';

function Call ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, withLabel }: Props): React.ReactElement<Props> {
  const { api, apiDefaultTx } = useApi();

  const [initialValue] = useState(
    (): SubmittableExtrinsicFunction<'promise'> => {
      try {
        return defaultValue && defaultValue.value
          ? defaultValue.value as SubmittableExtrinsicFunction<'promise'>
          : api.tx.balances.transfer;
      } catch (error) {
        return apiDefaultTx;
      }
    }
  );

  return (
    <Extrinsic
      className={className}
      defaultValue={initialValue}
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
