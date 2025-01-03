// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { AccountId, SocietyVote } from '@polkadot/types/interfaces';
import type { VoteType } from '../types.js';

import React, { useMemo } from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Votes from '../Overview/Votes.js';
import BidType from './BidType.js';
import CandidateVoting from './CandidateVoting.js';

interface Props {
  allMembers: string[];
  isMember: boolean;
  ownMembers: string[];
  value: DeriveSocietyCandidate;
}

function Candidate ({ allMembers, isMember, ownMembers, value: { accountId, kind, value } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const keys = useMemo(
    () => [allMembers.map((memberId): [AccountId, string] => [accountId, memberId])],
    [accountId, allMembers]
  );
  const votes = useCall<VoteType[]>(api.query.society.votes.multi, keys, {
    transform: (voteOpts: Option<SocietyVote>[]): VoteType[] =>
      voteOpts
        .map((voteOpt, index): [string, Option<SocietyVote>] => [allMembers[index], voteOpt])
        .filter(([, voteOpt]) => voteOpt.isSome)
        .map(([accountId, voteOpt]): VoteType => [accountId, voteOpt.unwrap()])
  });

  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='start'>
        <BidType value={kind} />
      </td>
      <Table.Column.Balance value={value} />
      <Votes votes={votes} />
      <td className='button'>
        <CandidateVoting
          candidateId={accountId.toString()}
          isMember={isMember}
          ownMembers={ownMembers}
        />
      </td>
    </tr>
  );
}

export default React.memo(Candidate);
