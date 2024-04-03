// [object Object]
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React from 'react';

import { PoolSize } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
  timeslice?: PalletBrokerStatusRecord | null;
  lastTimeslice?: u32 | null;
}

function Pools ({ children, className }: Props): React.ReactElement<Props> | null {
  return (
    <PoolSize
      className={className}
    >
      {children}
    </PoolSize>
  );
}

export default React.memo(Pools);
