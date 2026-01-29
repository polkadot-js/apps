// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerConfigRecord } from '@polkadot/types/lookup';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

function RegionLength ({ children, className }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const config = useCall<PalletBrokerConfigRecord>(api.query.broker?.configuration);
  const length = config?.toJSON()?.regionLength;

  return (
    <div className={className}>
      {length?.toString() || '-'}
      {children}
    </div>
  );
}

export default React.memo(RegionLength);
