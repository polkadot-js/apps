// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { MapMember } from './types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Candidates from './Candidates';
import Overview from './Overview';
import Suspended from './Suspended';
import { useTranslation } from './translate';
import useCounter from './useCounter';
import useMembers from './useMembers';
import useVoters from './useVoters';

interface Props {
  basePath: string;
  className?: string;
}

export { useCounter };

function getMapMembers (members: DeriveSocietyMember[], skeptics: string[], voters: string[], info: DeriveSociety): MapMember[] {
  return members
    .filter((member) => !info.hasDefender || !member.accountId.eq(info.defender))
    .map((member): MapMember => ({
      isFounder: info.founder?.eq(member.accountId),
      isHead: info.head?.eq(member.accountId),
      isSkeptic: skeptics.includes(member.accountId.toString()),
      isVoter: voters.includes(member.accountId.toString()),
      key: member.accountId.toString(),
      member
    }))
    .sort((a, b) =>
      a.isHead
        ? -1
        : b.isHead
          ? 1
          : a.isSkeptic
            ? -1
            : b.isSkeptic
              ? 1
              : a.isVoter
                ? -1
                : b.isVoter
                  ? 1
                  : a.isFounder
                    ? 1
                    : b.isFounder
                      ? -1
                      : 0
    );
}

function SocietyApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidateCount = useCounter();
  const { allMembers, isMember, ownMembers } = useMembers();
  const info = useCall<DeriveSociety>(api.derive.society.info);
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members);
  const { candidates, skeptics, voters } = useVoters();

  const mapMembers = useMemo(
    () => members && info
      ? getMapMembers(members, skeptics, voters, info)
      : undefined,
    [info, members, skeptics, voters]
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Society overview')
    },
    {
      count: candidateCount,
      name: 'candidates',
      text: t<string>('Candidates')
    },
    {
      name: 'suspended',
      text: t<string>('Suspended')
    }
  ], [candidateCount, t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/candidates`}>
          <Candidates
            allMembers={allMembers}
            candidates={candidates}
            isMember={isMember}
            ownMembers={ownMembers}
          />
        </Route>
        <Route path={`${basePath}/suspended`}>
          <Suspended />
        </Route>
        <Route>
          <Overview
            info={info}
            isMember={isMember}
            mapMembers={mapMembers}
            ownMembers={ownMembers}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(SocietyApp);
