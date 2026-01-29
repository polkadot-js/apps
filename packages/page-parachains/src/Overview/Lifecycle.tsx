// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsParasParaLifecycle } from '@polkadot/types/lookup';
import type { QueuedAction } from '../types.js';

import React from 'react';

import { SessionToTime } from '@polkadot/react-query';

interface Props {
  lifecycle: PolkadotRuntimeParachainsParasParaLifecycle | null;
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
