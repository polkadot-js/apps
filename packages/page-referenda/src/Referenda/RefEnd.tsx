// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  label: string;
  when: BN | null;
}

function RefEnd ({ className = '', label, when }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();

  return (
    <td className={`${className} number`}>
      {bestNumber && when && (
        <>
          <div>{label}</div>
          {when.gt(bestNumber) && (
            <BlockToTime value={when.sub(bestNumber)} />
          )}
          <div>#{formatNumber(when)}</div>
        </>
      )}
    </td>
  );
}

export default React.memo(RefEnd);
