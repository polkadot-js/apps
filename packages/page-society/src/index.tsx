// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { MapMember } from './types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_THREE, BN_TWO } from '@polkadot/util';

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

function strikeSort (a: MapMember, b: MapMember): number {
  return a.isWarned && b.isWarned
    ? b.member.strikes.cmp(a.member.strikes)
    : a.isWarned
      ? -1
      : b.isWarned
        ? 1
        : 0;
}

function secondarySort (a: MapMember, b: MapMember): number {
  const isVoterA = a.isCandidateVoter || a.member.isDefenderVoter;
  const isVoterB = b.isCandidateVoter || b.member.isDefenderVoter;

  return isVoterA && isVoterB
    ? strikeSort(a, b)
    : isVoterA
      ? -1
      : isVoterB
        ? 1
        : strikeSort(a, b);
}

function finalSort (a: MapMember, b: MapMember): number {
  return a.isHead
    ? -1
    : b.isHead
      ? 1
      : a.isFounder
        ? -1
        : b.isFounder
          ? 1
          : a.isSkeptic && b.isSkeptic
            ? secondarySort(a, b)
            : a.isSkeptic
              ? -1
              : b.isSkeptic
                ? 1
                : 0;
}

function getMapMembers (members: DeriveSocietyMember[], skeptics: string[], voters: string[], info: DeriveSociety, warnStrikes: BN): MapMember[] {
  return members
    .filter((member) => !info.hasDefender || !member.accountId.eq(info.defender))
    .map((member): MapMember => ({
      isCandidateVoter: voters.includes(member.accountId.toString()),
      isFounder: info.founder?.eq(member.accountId),
      isHead: info.head?.eq(member.accountId),
      isSkeptic: skeptics.includes(member.accountId.toString()),
      isWarned: member.strikes.gt(warnStrikes),
      key: member.accountId.toString(),
      member
    }))
    .sort(({ member: a }, { member: b }) => (b.payouts.length - a.payouts.length) || b.strikes.cmp(a.strikes))
    .sort(secondarySort)
    .sort(finalSort);
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
    () => members && info && skeptics && voters
      ? getMapMembers(members, skeptics, voters, info, api.consts.society.maxStrikes.mul(BN_TWO).div(BN_THREE))
      : undefined,
    [api, info, members, skeptics, voters]
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
