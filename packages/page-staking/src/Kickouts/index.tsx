// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import CurrentList from '@polkadot/app-staking/Kickouts/CurrentList';

import useKickOuts from './Kickouts';

export interface KickOutEvent {
  address: string;
  era: number;
  kickoutReason: string;
}

function KickoutsPage (): React.ReactElement {
  const kicks = useKickOuts();

  console.log(kicks);

  return (
    <section>
      <CurrentList
        kicks={kicks}
      />
    </section>
  );
}

export default React.memo(KickoutsPage);
