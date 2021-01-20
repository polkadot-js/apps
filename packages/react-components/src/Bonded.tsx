// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Bonded } from '@canvas-ui/react-query';
import { classes } from '@canvas-ui/react-util';
import BN from 'bn.js';
import React from 'react';

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import { renderProvided } from './Balance';
import { BareProps } from './types';

export interface Props extends BareProps {
  bonded?: BN | BN[];
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

function BondedDisplay (props: Props): React.ReactElement<Props> | null {
  const { bonded, className = '', label, params } = props;

  if (!params) {
    return null;
  }

  return bonded
    ? <>{renderProvided({ className, label, value: bonded })}</>
    : (
      <Bonded
        className={classes('ui--Bonded', className)}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BondedDisplay);
