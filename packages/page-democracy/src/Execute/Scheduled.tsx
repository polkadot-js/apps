// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ScheduledExt } from './types';

import React from 'react';

import { CallExpander } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: ScheduledExt;
}

function Scheduled ({ className = '', value: { blockNumber, call, maybeId, maybePeriodic } }: Props): React.ReactElement<Props> {
  const bestNumber = useBestNumber();
  const period = maybePeriodic.unwrapOr(null);
  const name = maybeId.unwrapOr(null);

  return (
    <tr className={className}>
      <td className='all'><CallExpander value={call} /></td>
      <td className='start'>
        {name && (
          name.isAscii
            ? name.toUtf8()
            : name.toHex()
        )}
      </td>
      <td className='number together'>
        {bestNumber && (
          <>
            <BlockToTime value={blockNumber.sub(bestNumber)} />
            #{formatNumber(blockNumber)}
          </>
        )}
      </td>
      <td className='number together'>
        {period && (
          formatNumber(period[0])
        )}
      </td>
      <td className='number together'>
        {period && (
          formatNumber(period[1])
        )}
      </td>
    </tr>
  );
}

export default React.memo(Scheduled);
