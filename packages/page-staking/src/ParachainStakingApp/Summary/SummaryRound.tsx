// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

import { RoundInfo } from '../types';

interface Props {
  className?: string;
  roundInfo: RoundInfo<unknown>
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
                  total: new BN(Number(roundInfo.length)),
                  value: new BN(Number(bestNumberFinalized) - Number(roundInfo.first)),
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
