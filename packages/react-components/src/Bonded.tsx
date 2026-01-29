// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';

import { Bonded } from '@polkadot/react-query';

import { renderProvided } from './Balance.js';

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
        className={`${className} ui--Bonded`}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BondedDisplay);
