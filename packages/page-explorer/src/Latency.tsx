// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import useLatency from './useLatency';

interface Props {
  className?: string;
}

export default function Latency ({ className }: Props): React.ReactElement<Props> | null {
  const { details } = useLatency();

  return (
    <div className={className}>
      {details.map(({ blockNumber, delay }) => (
        <div key={blockNumber}>{blockNumber}&nbsp;{(delay / 1000).toFixed(3)}</div>
      ))}
    </div>
  );
}
