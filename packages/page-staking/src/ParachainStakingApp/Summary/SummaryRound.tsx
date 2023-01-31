// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { ParachainStakingRoundInfo } from '../types';

import React from 'react';

import { CardSummary } from '@polkadot/react-components';

interface Props {
  className?: string;
  roundInfo?: ParachainStakingRoundInfo
  bestNumberFinalized: BlockNumber|undefined
}

function SummaryRound ({ bestNumberFinalized, className, roundInfo }: Props): React.ReactElement<Props> {
  return (
    <>
      {roundInfo && (
        <>
          {
            (
              <CardSummary
                className={className}
                label={'round'}
                progress={{
                  total: roundInfo.length,
                  value: bestNumberFinalized?.sub(roundInfo.first),
                  withTime: true
                }}
              />
            )
          }
        </>
      )}
    </>
  );
}

export default React.memo(SummaryRound);
