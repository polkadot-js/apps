// Copyright 2017-2024 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function PoolSize({ children, className = '' }: Props): React.ReactElement<Props> {

  const { api } = useApi();
  const status = useCall<PalletBrokerStatusRecord>(api.query.broker?.status);
  let systemPool: number = 0;
  let privatePool: number = 0;
  let poolSize: string = '';
  if (status === undefined ){
    poolSize = '0';
  } else {
    systemPool = status.toJSON()['systemPoolSize'] as number;
    privatePool = status.toJSON()['systemPoolSize'] as number;
    poolSize = (systemPool + privatePool).toString();
  }

  return (
    <div className={className}>
      {poolSize}
      {children}
    </div>
  );

}

export default React.memo(PoolSize);

