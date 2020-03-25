// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import { AccountId, SocietyVote } from '@polkadot/types/interfaces';
import { VoteType } from '../types';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import CandidateVoting from './CandidateVoting';
import VoteDisplay from './VoteDisplay';

interface Props {
  allMembers: string[];
  isMember: boolean;
  ownMembers: string[];
  value: DeriveSocietyCandidate;
}

function Candidate ({ allMembers, isMember, ownMembers, value: { accountId, kind, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const votes = useCall<VoteType[]>(api.query.society.votes.multi as any, [allMembers.map((memberId): [AccountId, string] => [accountId, memberId])] as any, {
    transform: (voteOpts: Option<SocietyVote>[]): VoteType[] =>
      voteOpts
        .map((voteOpt, index): [string, Option<SocietyVote>] => [allMembers[index], voteOpt])
        .filter(([, voteOpt]): boolean => voteOpt.isSome)
        .map(([accountId, voteOpt]): VoteType => [accountId, voteOpt.unwrap()])
  });

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number top'>
        <label>{t('kind')}</label>
        {kind.type}
      </td>
      <td className='number top'>
        <FormatBalance
          label={<label>{t('value')}</label>}
          value={value}
        />
      </td>
      <VoteDisplay votes={votes} />
      <td className='number together top'>
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
