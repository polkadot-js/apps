// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';
import type { MapMember } from './types';

import BN from 'bn.js';
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

// head -> founder -> skeptics -> votes -> suspended -> strikes -> strikes -> payouts
function sortMembers (a: MapMember, b: MapMember): number {
  const isVoterA = a.isCandidateVoter || a.isDefenderVoter;

  return a.isHead !== b.isHead
    ? (a.isHead ? -1 : 1)
    : a.isFounder !== b.isFounder
      ? (a.isFounder ? -1 : 1)
      : a.isSkeptic !== b.isSkeptic
        ? (a.isSkeptic ? -1 : 1)
        : isVoterA !== (b.isCandidateVoter || b.isDefenderVoter)
          ? (isVoterA ? -1 : 1)
          // : a.isDefenderVoter !== b.isDefenderVoter
          //   ? (a.isDefenderVoter ? -1 : 1)
          //   : a.isCandidateVoter !== b.isCandidateVoter
          //     ? (a.isCandidateVoter ? -1 : 1)
          : a.isSuspended !== b.isSuspended
            ? (a.isSuspended ? -1 : 1)
            : a.isWarned !== b.isWarned
              ? (a.isWarned ? -1 : 1)
              : (b.strikes.cmp(a.strikes) || (b.payouts.length - a.payouts.length));
}

function getMapMembers (members: DeriveSocietyMember[], skeptics: string[], voters: string[], { defender, founder, hasDefender, head }: DeriveSociety, warnStrikes: BN): [MapMember[], BN] {
  const mapMembers = members
    .filter((member) => !hasDefender || !member.accountId.eq(defender))
    .map(({ accountId, isDefenderVoter, isSuspended, payouts, strikes }): MapMember => {
      const key = accountId.toString();

      return {
        accountId,
        isCandidateVoter: voters.includes(key),
        isDefenderVoter,
        isFounder: !!founder?.eq(accountId),
        isHead: !!head?.eq(accountId),
        isSkeptic: skeptics.includes(key),
        isSuspended,
        isWarned: !isSuspended && strikes.gt(warnStrikes),
        key,
        payouts,
        strikes
      };
    })
    .sort(sortMembers);

  return [
    mapMembers,
    mapMembers.reduce((total, { payouts }) =>
      payouts.reduce((total, [, balance]) => total.iadd(balance), total), new BN(0)
    )
  ];
}

function SocietyApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const candidateCount = useCounter();
  const { allMembers, isMember, ownMembers } = useMembers();
  const info = useCall<DeriveSociety>(api.derive.society.info);
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members);
  const { candidates, skeptics, voters } = useVoters();

  const [mapMembers, payoutTotal] = useMemo(
    () => members && info && skeptics && voters
      ? getMapMembers(members, skeptics, voters, info, api.consts.society.maxStrikes.mul(BN_TWO).div(BN_THREE))
      : [undefined, undefined],
    [api, info, members, skeptics, voters]
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
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
      <Tabs
        basePath={basePath}
        items={items}
      />
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
            payoutTotal={payoutTotal}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(SocietyApp);
