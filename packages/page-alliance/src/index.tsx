// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Hash } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Motions from '@polkadot/app-tech-comm/Proposals';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall, useCollectiveMembers } from '@polkadot/react-hooks';

import Announcements from './Announcements';
import Overview from './Overview';
import { useTranslation } from './translate';
import Unscrupelous from './Unscrupelous';
import useAnnoucements from './useAnnoucements';
import useMembers from './useMembers';
import useRule from './useRule';
import useUnscrupelous from './useUnscrupelous';

interface Props {
  basePath: string;
  className?: string;
}

function AllianceApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const prime = useCall<AccountId | null>(api.derive.allianceMotion.prime);
  const proposalHashes = useCall<Hash[]>(api.derive.allianceMotion.proposalHashes);
  const { isMember: isVoter, members: voters } = useCollectiveMembers('allianceMotion');
  const accouncements = useAnnoucements();
  const members = useMembers();
  const rule = useRule();
  const unscrupelous = useUnscrupelous();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'announcements',
      text: t<string>('Announcements')
    },
    {
      name: 'motions',
      text: t<string>('Motions ({{count}})', { replace: { count: (proposalHashes && proposalHashes.length) || 0 } })
    },
    {
      name: 'unscrupelous',
      text: t<string>('Unscrupelous')
    }
  ], [proposalHashes, t]);

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
            isMember={isVoter}
            members={voters}
            prime={prime}
            proposalHashes={proposalHashes}
            type='allianceMotion'
          />
        </Route>
        <Route path={`${basePath}/unscrupelous`}>
          <Unscrupelous unscrupelous={unscrupelous} />
        </Route>
        <Route>
          <Overview
            isVoter={isVoter}
            members={members}
            prime={prime}
            rule={rule}
            unscrupelous={unscrupelous}
            voters={voters}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(AllianceApp);
