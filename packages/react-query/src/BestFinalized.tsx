// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import type { BlockNumber } from '@polkadot/types/interfaces';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function BestFinalized ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(api.derive.chain.bestNumberFinalized);

  return (
    <div className={className}>
      {label || ''}{
        bestNumberFinalized
          ? formatNumber(bestNumberFinalized)
          : '-'
      }{children}
    </div>
  );
}

export default React.memo(BestFinalized);
