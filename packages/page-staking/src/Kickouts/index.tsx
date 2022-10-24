// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import CurrentList from '@polkadot/app-staking/Kickouts/CurrentList';
import { MarkWarning } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import useKickOuts from './Kickouts';

export interface KickOutEvent {
  address: string;
  era: number;
  kickoutReason: string;
}

function KickoutsPage (): React.ReactElement {
  const { api } = useApi();
  const kicks = useKickOuts();

  if (!api.runtimeChain.toString().includes('Aleph Zero')) {
    return (
      <MarkWarning content={'Unsupported chain.'} />
    );
  }

  return (
    <section>
      <CurrentList
        kicks={kicks}
      />
    </section>
  );
}

export default React.memo(KickoutsPage);
