// Copyright 2017-2023 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ScheduledExt } from './types.js';

import React from 'react';

import Hash from '@polkadot/app-preimages/Preimages/Hash';
import { CallExpander } from '@polkadot/react-components';
import { usePreimage } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  bestNumber?: BlockNumber;
  className?: string;
  value: ScheduledExt;
}

function Scheduled ({ bestNumber, className = '', value: { blockNumber, call, maybeId, maybePeriodic, preimageHash } }: Props): React.ReactElement<Props> {
  const preimage = usePreimage(preimageHash);
  const period = maybePeriodic.unwrapOr(null);
  const name = maybeId.unwrapOr(null);

  return (
    <tr className={className}>
      <td className='all'>
        <CallExpander value={call || preimage?.proposal} />
      </td>
      {name
        ? name.isAscii
          ? <td className='start'>{name.toUtf8()}</td>
          : <Hash value={name.toHex()} />
        : <td />
      }
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
