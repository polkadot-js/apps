// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Hash, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { AddressMini, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useVotingStatus, useWeight } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Close from './Close';
import Voting from './Voting';

interface Props {
  className?: string;
  imageHash: Hash;
  isMember: boolean;
  members: string[];
  prime?: AccountId | null;
}

const transformProposal = {
  transform: (optProp: Option<ProposalType>) => optProp.unwrapOr(null)
};

const transformVotes = {
  transform: (optVotes: Option<Votes>) => optVotes.unwrapOr(null)
};

function Proposal ({ className = '', imageHash, members, prime }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const proposal = useCall<ProposalType | null>(api.query.technicalCommittee.proposalOf, [imageHash], transformProposal);
  const votes = useCall<Votes | null>(api.query.technicalCommittee.voting, [imageHash], transformVotes);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'technicalCommittee');
  const [proposalWeight, proposalLength] = useWeight(proposal);

  const [councilId, isMultiMembers] = useMemo(
    (): [string | null, boolean] => {
      const councilIds = allAccounts.filter((accountId) => members.includes(accountId));

      return [councilIds[0] || null, councilIds.length > 1];
    },
    [allAccounts, members]
  );

  if (!proposal || !votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={proposal}
      />
      <td className='number'>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime blocks={remainingBlocks} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <td className='address'>
        {ayes.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address.toHex()}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='address'>
        {nays.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address.toHex()}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='button'>
        {isVoteable && !isCloseable && (
          <Voting
            hash={imageHash}
            members={members}
            prime={prime}
            proposalId={index}
          />
        )}
        {isCloseable && (
          isMultiMembers
            ? (
              <Close
                hasFailed={hasFailed}
                hash={imageHash}
                idNumber={index}
                members={members}
                proposal={proposal}
              />
            )
            : (
              <TxButton
                accountId={councilId}
                icon='times'
                label={t<string>('Close')}
                params={
                  api.tx.technicalCommittee.close?.meta.args.length === 4
                    ? hasFailed
                      ? [imageHash, index, 0, 0]
                      : [imageHash, index, proposalWeight, proposalLength]
                    : [imageHash, index]
                }
                tx='technicalCommittee.close'
              />
            )
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
