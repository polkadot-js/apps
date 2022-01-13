// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

interface Props {
  className?: string;
  roundInfo: RoundInfo<unknown>
  bestNumberFinalized: BlockNumber|undefined
}

export interface RoundInfo<T> {
  current: T;
  first: T;
  length: T;
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
