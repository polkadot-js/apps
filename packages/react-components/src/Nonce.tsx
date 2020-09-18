// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import { Nonce } from '@polkadot/react-query';

import { classes } from './util';

export interface Props {
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function NonceDisplay ({ className = '', label, params }: Props): React.ReactElement<Props> | null {
  if (!params) {
    return null;
  }

  return (
    <Nonce
      className={classes('ui--Nonce', className)}
      label={label}
      params={params.toString()}
    />
  );
}

export default React.memo(NonceDisplay);
