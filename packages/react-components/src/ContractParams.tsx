// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFnArg } from '@polkadot/api-contract/types';
import { RawParams } from '@canvas-ui/react-params/types';

import React from 'react';
import UIParams from '@canvas-ui/react-params';

interface Props {
  isDisabled?: boolean;
  params?: ContractABIFnArg[];
  onChange: (values: RawParams) => void;
  onEnter?: () => void;
  values: RawParams;
}

function Params ({ isDisabled, onChange, onEnter, params = [], values }: Props): React.ReactElement<Props> | null {
  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={onChange}
      onEnter={onEnter}
      params={params}
      values={values}
    />
  );
}

export default React.memo(Params);
