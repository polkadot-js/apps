// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { BrokerStatus } from '@polkadot/react-query';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Cores ({ children, className }: Props): React.ReactElement<Props> | null {
  return (
    <BrokerStatus
      className={className}
      query='coreCount'
    >
      {children}
    </BrokerStatus>
  );
}

export default React.memo(Cores);
