// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaLifecycle } from '@polkadot/types/interfaces';
import type { QueuedAction } from '../types';

import React from 'react';

import { SessionToTime } from '@polkadot/react-query';

interface Props {
  lifecycle: ParaLifecycle | null;
  nextAction?: QueuedAction;
}

function Lifecycle ({ lifecycle, nextAction }: Props): React.ReactElement<Props> | null {
  return lifecycle && (
    <>
      {lifecycle.toString()}
      {nextAction && (
        <SessionToTime value={nextAction.sessionIndex} />
      )}
    </>
  );
}

export default React.memo(Lifecycle);
