// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import React from 'react';
import { LockedVote } from '@polkadot/react-query';

import { classes } from './util';

export interface Props extends BareProps {
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

export default function LockedVoteDisplay (props: Props): React.ReactElement<Props> | null {
  const { params, className, label, style } = props;

  if (!params) {
    return null;
  }

  return (
    <LockedVote
      className={classes('ui--LockedVote', className)}
      label={label}
      params={params}
      style={style}
    />
  );
}
