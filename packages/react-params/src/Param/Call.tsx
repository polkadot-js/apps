// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Props } from '@canvas-ui/react-components/types';
import { useApi } from '@canvas-ui/react-hooks';
import React from 'react';

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';

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
