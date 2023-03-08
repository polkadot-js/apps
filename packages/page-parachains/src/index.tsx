// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import type { ParaId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Auctions from './Auctions.js';
import Crowdloan from './Crowdloan.js';
import Overview from './Overview.js';
import Parathreads from './Parathreads.js';
import Proposals from './Proposals.js';
import { useTranslation } from './translate.js';
import useActionsQueue from './useActionsQueue.js';
import useAuctionInfo from './useAuctionInfo.js';
import useFunds from './useFunds.js';
import useLeasePeriod from './useLeasePeriod.js';
import useOwnedIds from './useOwnedIds.js';
import useProposals from './useProposals.js';
import useUpcomingIds from './useUpcomingIds.js';
import useWinningData from './useWinningData.js';

interface Props {
  basePath: string;
  className?: string;
}

function ParachainsApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const auctionInfo = useAuctionInfo();
  const campaigns = useFunds();
  const leasePeriod = useLeasePeriod();
  const ownedIds = useOwnedIds();
  const winningData = useWinningData(auctionInfo);
  const proposals = useProposals();
  const actionsQueue = useActionsQueue();
  const upcomingIds = useUpcomingIds();
  const paraIds = useCall<ParaId[]>(api.query.paras.parachains);

  const items = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'parathreads',
      text: t<string>('Parathreads')
    },
    api.query.proposeParachain && {
      name: 'proposals',
      text: t<string>('Proposals')
    },
    api.query.auctions && {
      name: 'auctions',
      text: t<string>('Auctions')
    },
    api.query.crowdloan && {
      name: 'crowdloan',
      text: t<string>('Crowdloan')
    }
  ].filter((q) => !!q));

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={items.current}
      />
      <Switch>
        <Route path={`${basePath}/auctions`}>
          <Auctions
            auctionInfo={auctionInfo}
            campaigns={campaigns}
            ownedIds={ownedIds}
            winningData={winningData}
          />
        </Route>
        <Route path={`${basePath}/crowdloan`}>
          <Crowdloan
            auctionInfo={auctionInfo}
            campaigns={campaigns}
            leasePeriod={leasePeriod}
            ownedIds={ownedIds}
          />
        </Route>
        <Route path={`${basePath}/proposals`}>
          <Proposals proposals={proposals} />
        </Route>
      </Switch>
      <Overview
        actionsQueue={actionsQueue}
        className={pathname === basePath ? '' : '--hidden'}
        leasePeriod={leasePeriod}
        paraIds={paraIds}
        proposals={proposals}
        threadIds={upcomingIds}
      />
      <Parathreads
        actionsQueue={actionsQueue}
        className={pathname === `${basePath}/parathreads` ? '' : '--hidden'}
        ids={upcomingIds}
        leasePeriod={leasePeriod}
        ownedIds={ownedIds}
      />
    </main>
  );
}

export default React.memo(ParachainsApp);
