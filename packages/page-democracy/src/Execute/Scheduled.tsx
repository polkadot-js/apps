// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { ScheduledExt } from './types';

import React from 'react';
import { CallExpander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: ScheduledExt;
}

function Scheduled ({ className = '', value: { blockNumber, call, maybeId, maybePeriodic } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

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
            <BlockToTime blocks={blockNumber.sub(bestNumber)} />
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
