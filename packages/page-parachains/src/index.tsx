// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import Auctions from './Auctions';
import Crowdloan from './Crowdloan';
import Overview from './Overview';
import Proposals from './Proposals';
import { useTranslation } from './translate';
import useAuctionInfo from './useAuctionInfo';
import useLeasePeriod from './useLeasePeriod';
import useOwnedIds from './useOwnedIds';
import useProposals from './useProposals';

interface Props {
  basePath: string;
  className?: string;
}

function ParachainsApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const auctionInfo = useAuctionInfo();
  const leasePeriod = useLeasePeriod();
  const ownedIds = useOwnedIds();
  const proposals = useProposals();

  const items = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
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
  ].filter((q): q is { name: string; text: string } => !!q));

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
            ownedIds={ownedIds}
          />
        </Route>
        <Route path={`${basePath}/crowdloan`}>
          <Crowdloan
            auctionInfo={auctionInfo}
            leasePeriod={leasePeriod}
            ownedIds={ownedIds}
          />
        </Route>
        <Route path={`${basePath}/proposals`}>
          <Proposals proposals={proposals} />
        </Route>
      </Switch>
      <Overview
        className={basePath === pathname ? '' : 'parachains--hidden'}
        leasePeriod={leasePeriod}
        proposals={proposals}
      />
    </main>
  );
}

export default React.memo(styled(ParachainsApp)`
  .parachains--hidden {
    display: none;
  }
`);
