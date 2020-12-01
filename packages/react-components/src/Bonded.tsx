// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { Bonded } from '@polkadot/react-query';

import { renderProvided } from './Balance';

export interface Props {
  bonded?: BN | BN[];
  className?: string;
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
        className={`ui--Bonded ${className}`}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BondedDisplay);
