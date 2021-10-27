// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry } from '@polkadot/types/types';

import { UseTxParams } from '@canvas-ui/react-components/types';
import React from 'react';

import UIParams from './Param/Params';

interface Props extends UseTxParams {
  isDisabled?: boolean;
  onEnter?: () => void;
  registry: Registry;
}

function Params ({ isDisabled, onChange, onEnter, params = [], values, registry }: Props): React.ReactElement<Props> | null {
  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={onChange}
      onEnter={onEnter}
      params={params}
      registry={registry}
      values={values}
    />
  );
}

export default React.memo(Params);
