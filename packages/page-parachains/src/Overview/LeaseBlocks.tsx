// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { LeasePeriod } from '../types.js';

import React, { useMemo } from 'react';

import { BlockToTime } from '@polkadot/react-query';
import { BN_ONE, bnToBn } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  leasePeriod?: LeasePeriod | null;
  value?: number | BN | null;
}

function calcBlocks (leasePeriod?: LeasePeriod | null, value?: number | BN | null): BN | null | undefined | 0 {
  return leasePeriod && value &&
    bnToBn(value)
      .sub(BN_ONE)
      .imul(leasePeriod.length)
      .iadd(leasePeriod.remainder);
}

function LeaseBlocks ({ children, className, leasePeriod, value }: Props): React.ReactElement<Props> | null {
  const blocks = useMemo(
    () => calcBlocks(leasePeriod, value),
    [leasePeriod, value]
  );

  if (!blocks) {
    return null;
  }

  return (
    <BlockToTime
      className={className}
      value={blocks}
    >
      {children}
    </BlockToTime>
  );
}

export default React.memo(LeaseBlocks);
