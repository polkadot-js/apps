// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Available } from '@canvas-ui/react-query';
import { classes } from '@canvas-ui/react-util';
import React from 'react';

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import { BareProps } from './types';

export interface Props extends BareProps {
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function AvailableDisplay ({ className = '', label, params }: Props): React.ReactElement<Props> | null {
  if (!params) {
    return null;
  }

  return (
    <Available
      className={classes('ui--Available', className)}
      label={label}
      params={params}
    />
  );
}

export default React.memo(AvailableDisplay);
