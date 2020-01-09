// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

export default function BestNumber ({ children, className, label, style }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const bestNumber = useCall<BlockNumber>(isApiReady ? api.derive.chain.bestNumber as any : undefined, []);

  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{
        bestNumber
          ? formatNumber(bestNumber)
          : '-'
      }{children}
    </div>
  );
}
