// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { LeasePeriod, Proposals, QueuedAction } from '../types';

import React from 'react';

import Parachains from './Parachains';
import Summary from './Summary';

interface Props {
  actionsQueue: QueuedAction[];
  className?: string;
  leasePeriod?: LeasePeriod;
  paraIds?: ParaId[];
  proposals?: Proposals;
  threadIds?: ParaId[];
  upcomingIds?: ParaId[];
}

function Overview ({ actionsQueue, className, leasePeriod, paraIds, proposals, threadIds }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        leasePeriod={leasePeriod}
        parachainCount={paraIds?.length}
        proposalCount={proposals?.proposalIds.length}
        upcomingCount={threadIds?.length}
      />
      <Parachains
        actionsQueue={actionsQueue}
        ids={paraIds}
        leasePeriod={leasePeriod}
        scheduled={proposals?.scheduled}
      />
    </div>
  );
}

export default React.memo(Overview);
