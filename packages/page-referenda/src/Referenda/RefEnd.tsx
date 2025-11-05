// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { useBestNumberRelay, useStakingAsyncApis } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  label: string;
  when: BN | null;
}

function RefEnd ({ className = '', label, when }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumberRelay();
  const { isStakingAsync, rcApi } = useStakingAsyncApis();

  return (
    <td className={`${className} number`}>
      {bestNumber && when && (
        <>
          <div>{label}</div>
          {/* Remaining period should be decided based on Relay chain */}
          {when.gt(bestNumber) && (
            <BlockToTime
              api={isStakingAsync ? rcApi : undefined}
              value={when.sub(bestNumber)}
            />
          )}
          <div>#{formatNumber(when)}</div>
        </>
      )}
    </td>
  );
}

export default React.memo(RefEnd);
