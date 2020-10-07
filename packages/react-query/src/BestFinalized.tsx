// Copyright 2017-2020 @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-api/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@canvas-ui/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

function BestFinalized ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(api.derive.chain.bestNumberFinalized, []);

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
