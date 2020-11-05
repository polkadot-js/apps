// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Hash } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Icon, LinkExternal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useVotingStatus, useWeight } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Close from './Close';
import Voters from './Voters';
import Voting from './Voting';

interface Props {
  className?: string;
  hash: Hash;
  isMember: boolean;
  members: string[];
  prime: AccountId | null;
}

interface VoterState {
  hasVoted: boolean;
  hasVotedAye: boolean;
}

function Motion ({ className = '', hash, isMember, members, prime }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const motion = useCall<DeriveCollectiveProposal | null>(api.derive.council.proposal, [hash]);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(motion?.votes, members.length, 'council');
  const [proposalWeight, proposalLength] = useWeight(motion?.proposal);

  const [councilId, isMultiMembers] = useMemo(
    (): [string | null, boolean] => {
      const councilIds = allAccounts.filter((accountId) => members.includes(accountId));

      return [councilIds[0] || null, councilIds.length > 1];
    },
    [allAccounts, members]
  );

  const { hasVoted, hasVotedAye } = useMemo(
    (): VoterState => {
      if (motion && motion.votes) {
        const { votes } = motion;
        const hasVotedAye = allAccounts.some((address) => votes.ayes.some((accountId) => accountId.eq(address)));

        return {
          hasVoted: hasVotedAye || allAccounts.some((address) => votes.nays.some((accountId) => accountId.eq(address))),
          hasVotedAye
        };
      }

      return { hasVoted: false, hasVotedAye: false };
    },
    [allAccounts, motion]
  );

  if (!motion || !motion.votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = motion.votes;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={hash}
        proposal={motion.proposal}
      />
      <td className='number together'>
        {formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime blocks={remainingBlocks} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <td className='expand'>
        <Voters
          isAye
          members={members}
          threshold={threshold}
          votes={ayes}
        />
        <Voters
          members={members}
          threshold={threshold}
          votes={nays}
        />
      </td>
      <td className='button'>
        {isVoteable && !isCloseable && (
          <Voting
            hash={hash}
            idNumber={index}
            isDisabled={!isMember}
            members={members}
            prime={prime}
            proposal={motion.proposal}
          />
        )}
        {isCloseable && (
          isMultiMembers
            ? (
              <Close
                hasFailed={hasFailed}
                hash={hash}
                idNumber={index}
                members={members}
                proposal={motion.proposal}
              />
            )
            : (
              <TxButton
                accountId={councilId}
                icon='times'
                label={t<string>('Close')}
                params={
                  api.tx.council.close?.meta.args.length === 4
                    ? hasFailed
                      ? [hash, index, 0, 0]
                      : [hash, index, proposalWeight, proposalLength]
                    : [hash, index]
                }
                tx='council.close'
              />
            )
        )}
      </td>
      <td className='badge'>
        {isMember && (
          <Icon
            color={hasVoted ? (hasVotedAye ? 'green' : 'red') : 'gray'}
            icon='asterisk'
          />
        )}
      </td>
      <td className='links'>
        <LinkExternal
          data={index}
          hash={hash.toString()}
          isLogo
          type='council'
        />
      </td>
    </tr>
  );
}

export default React.memo(Motion);
