// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletColl, PalletPoll } from './types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import Referenda from '@polkadot/app-referenda/Referenda';
import { Tabs } from '@polkadot/react-components';

import Members from './Members';
import { useTranslation } from './translate';
import useMemberIds from './useMemberIds';

interface Props {
  basePath: string;
  className?: string;
  palletColl: PalletColl;
  palletPoll: PalletPoll;
}

function App ({ basePath, className, palletColl, palletPoll }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const members = useMemberIds(palletColl);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'referenda',
      text: t<string>('Referenda')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/referenda`}>
          <Referenda
            isVoteBasic
            members={members}
            palletReferenda={palletPoll}
            palletVote={palletColl}
          />
        </Route>
        <Route>
          <Members members={members} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(App);
