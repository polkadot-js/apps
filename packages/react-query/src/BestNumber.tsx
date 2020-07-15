// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  withPound?: boolean;
}

function BestNumber ({ children, className = '', label, withPound }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const bestNumber = useCall<BlockNumber>(isApiReady && api.derive.chain.bestNumber, []);

  return (
    <div className={className}>
      {label || ''}{withPound && '#'}{
        bestNumber
          ? formatNumber(bestNumber)
          : '-'
      }{children}
    </div>
  );
}

export default React.memo(BestNumber);
