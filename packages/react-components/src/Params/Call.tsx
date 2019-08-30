// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { Props as BaseProps } from '@polkadot/react-params/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { withApi } from '@polkadot/react-api';

import Extrinsic from './Extrinsic';

type Props = ApiProps & BaseProps;

function Call ({ apiDefaultTx, api, className, isDisabled, isError, label, onChange, onEnter, style, withLabel }: Props): React.ReactElement<Props> {
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

export default withApi(Call);
