// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyCandidate } from '@polkadot/api-derive/types';
import { AccountId, SocietyVote } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { AddressMini, AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import CandidateVoting from './CandidateVoting';

interface Props {
  allMembers: string[];
  isMember: boolean;
  ownMembers: string[];
  value: DeriveSocietyCandidate;
}

type VoteType = [string, SocietyVote];

interface VoteSplit {
  allAye: VoteType[];
  allNay: VoteType[];
  allSkeptic: VoteType[];
}

export default function Candidate ({ allMembers, isMember, ownMembers, value: { accountId, kind, value } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ allAye, allNay, allSkeptic }, setVoteSplit] = useState<VoteSplit>({ allAye: [], allNay: [], allSkeptic: [] });
  const votes = useCall<VoteType[]>(api.query.society.votes.multi as any, [allMembers.map((memberId): [AccountId, string] => [accountId, memberId])] as any, {
    transform: (voteOpts: Option<SocietyVote>[]): VoteType[] =>
      voteOpts
        .map((voteOpt, index): [string, Option<SocietyVote>] => [allMembers[index], voteOpt])
        .filter(([, voteOpt]): boolean => voteOpt.isSome)
        .map(([accountId, voteOpt]): VoteType => [accountId, voteOpt.unwrap()])
  });

  useEffect((): void => {
    if (votes) {
      setVoteSplit({
        allAye: votes.filter(([, vote]): boolean => vote.isApprove),
        allNay: votes.filter(([, vote]): boolean => vote.isReject),
        allSkeptic: votes.filter(([, vote]): boolean => vote.isSkeptic)
      });
    }
  }, [votes]);

  return (
    <tr>
      <td className='top'>
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
      <td className='top padtop'>
        {allSkeptic.length !== 0 && (
          <details>
            <summary>
              {t('Skeptics ({{count}})', { replace: { count: allSkeptic.length } })}
            </summary>
            {allSkeptic.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
      <td className='top padtop'>
        {allAye.length !== 0 && (
          <details>
            <summary>
              {t('Approvals ({{count}})', { replace: { count: allAye.length } })}
            </summary>
            {allAye.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
      <td className='top padtop'>
        {allNay.length !== 0 && (
          <details>
            <summary>
              {t('Rejections ({{count}})', { replace: { count: allNay.length } })}
            </summary>
            {allNay.map(([who]): React.ReactNode =>
              <AddressMini
                key={who.toString()}
                value={who}
              />
            )}
          </details>
        )}
      </td>
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
