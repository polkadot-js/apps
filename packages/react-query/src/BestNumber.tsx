// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';

import { Digits } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isFinalized?: boolean;
  label?: React.ReactNode;
  withPound?: boolean;
}

function BestNumber ({ children, className = '', isFinalized, label, withPound }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const bestNumber = useCall<BlockNumber>(isApiReady && (isFinalized ? api.derive.chain.bestNumberFinalized : api.derive.chain.bestNumber));

  return (
    <div className={className}>
      {label || ''}{withPound && '#'}{
        bestNumber
          ? <Digits value={formatNumber(bestNumber)} />
          : '-'
      }{children}
    </div>
  );
}

export default React.memo(BestNumber);
