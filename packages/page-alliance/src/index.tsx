// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Motions from '@polkadot/app-tech-comm/Proposals';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall, useCollectiveMembers } from '@polkadot/react-hooks';

import Announcements from './Announcements';
import Members from './Members';
import { useTranslation } from './translate';
import Unscrupulous from './Unscrupulous';
import useAnnoucements from './useAnnoucements';
import useMembers from './useMembers';
import useRule from './useRule';
import useUnscrupulous from './useUnscrupulous';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
  className?: string;
}

// TODO Make configurable
const DEFAULT_THRESHOLD = 2 / 3;

function AllianceApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposalHashes = useCall<Hash[]>(api.derive.alliance.proposalHashes);
  const { isMember: isVoter, members: voters, prime } = useCollectiveMembers('alliance');
  const accouncements = useAnnoucements();
  const members = useMembers();
  const rule = useRule();
  const unscrupulous = useUnscrupulous();

  const motionFilter = useCallback(
    (section: string) => section === 'alliance',
    []
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'motions',
      text: t<string>('Motions ({{count}})', { replace: { count: (proposalHashes && proposalHashes.length) || 0 } })
    },
    {
      name: 'announcements',
      text: t<string>('Announcements ({{count}})', { replace: { count: (accouncements && accouncements.length) || 0 } })
    },
    {
      name: 'unscrupulous',
      text: t<string>('Unscrupulous')
    }
  ], [accouncements, proposalHashes, t]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/announcements`}>
          <Announcements accouncements={accouncements} />
        </Route>
        <Route path={`${basePath}/motions`}>
          <Motions
            defaultProposal={api.tx.alliance.addUnscrupulousItems}
            defaultThreshold={DEFAULT_THRESHOLD}
            filter={motionFilter}
            isMember={isVoter}
            members={voters}
            prime={prime}
            proposalHashes={proposalHashes}
            type='alliance'
          />
        </Route>
        <Route path={`${basePath}/unscrupulous`}>
          <Unscrupulous unscrupulous={unscrupulous} />
        </Route>
        <Route>
          <Members
            isVoter={isVoter}
            members={members}
            prime={prime}
            rule={rule}
            unscrupulous={unscrupulous}
            voters={voters}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(AllianceApp);
