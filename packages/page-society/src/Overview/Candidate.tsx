// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import { AccountId, SocietyVote } from '@polkadot/types/interfaces';
import { VoteType } from '../types';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import CandidateVoting from './CandidateVoting';
import Votes from './Votes';

interface Props {
  allMembers: string[];
  isMember: boolean;
  ownMembers: string[];
  value: DeriveSocietyCandidate;
}

function Candidate ({ allMembers, isMember, ownMembers, value: { accountId, kind, value } }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const votes = useCall<VoteType[]>(api.query.society.votes.multi, [allMembers.map((memberId): [AccountId, string] => [accountId, memberId])] as any, {
    transform: (voteOpts: Option<SocietyVote>[]): VoteType[] =>
      voteOpts
        .map((voteOpt, index): [string, Option<SocietyVote>] => [allMembers[index], voteOpt])
        .filter(([, voteOpt]): boolean => voteOpt.isSome)
        .map(([accountId, voteOpt]): VoteType => [accountId, voteOpt.unwrap()])
  });

  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number'>
        {kind.type}
      </td>
      <td className='number'>
        <FormatBalance value={value} />
      </td>
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
