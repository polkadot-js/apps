// Copyright 2017-2024 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
  query: string;
}

function BrokerStatus({ children, className = '', query }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const status = useCall<PalletBrokerStatusRecord>(api.query.broker?.status);
  const strStatus = status === undefined ? '' : status.toJSON()[query]

  return (
    <div className={className}>
      {strStatus?.toString()}
      {children}
    </div>
  );
}

export default React.memo(BrokerStatus);

