// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React from 'react';

import { BrokerStatus } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
  timeslice?: PalletBrokerStatusRecord | null;
  lastTimeslice?: u32 | null;
}

function Timeslice ({ children, className }: Props): React.ReactElement<Props> | null {
  return (
    <BrokerStatus
      className={className}
      query='lastTimeslice'
    >
      {children}
    </BrokerStatus>
  );
}

export default React.memo(Timeslice);
