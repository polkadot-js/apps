// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { Bonded } from '@polkadot/react-query';

import { renderProvided } from './Balance';
import { classes } from './util';

export interface Props extends BareProps {
  bonded?: BN | BN[];
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

function BondedDisplay (props: Props): React.ReactElement<Props> | null {
  const { bonded, className, label, params, style } = props;

  if (!params) {
    return null;
  }

  return bonded
    ? (
      <>
        {renderProvided({ className, label, value: bonded })}
      </>
    )
    : (
      <Bonded
        className={classes('ui--Bonded', className)}
        label={label}
        params={params}
        style={style}
      />
    );
}

export default React.memo(BondedDisplay);
