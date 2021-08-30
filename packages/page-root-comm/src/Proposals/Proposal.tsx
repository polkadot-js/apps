// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

<<<<<<< HEAD
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, Hash } from '@polkadot/types/interfaces';
=======
import type { Option } from '@polkadot/types';
import type { AccountId, Hash, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';
>>>>>>> ternoa-master

import React, { useMemo } from 'react';

import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { AddressMini, TxButton } from '@polkadot/react-components';
<<<<<<< HEAD
import { useAccounts, useApi, useCall, useCollectiveInstance, useVotingStatus, useWeight } from '@polkadot/react-hooks';
=======
import { useAccounts, useApi, useCall, useVotingStatus, useWeight } from '@polkadot/react-hooks';
>>>>>>> ternoa-master
import { BlockToTime } from '@polkadot/react-query';
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
<<<<<<< HEAD
  type: 'membership' | 'rootCommittee';
}

function Proposal({ className = '', imageHash, members, prime, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const derive = useCall<DeriveCollectiveProposal>(api.query.rootCommittee.proposal, [imageHash]);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(derive?.votes, members.length, type);
  const [proposalWeight, proposalLength] = useWeight(derive?.proposal);
  const modLocation = useCollectiveInstance(type);
=======
}

const transformProposal = {
  transform: (optProp: Option<ProposalType>) => optProp.unwrapOr(null)
};

const transformVotes = {
  transform: (optVotes: Option<Votes>) => optVotes.unwrapOr(null)
};

function Proposal({ className = '', imageHash, members, prime }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const proposal = useCall<ProposalType | null>(api.query.rootCommittee.proposalOf, [imageHash], transformProposal);
  const votes = useCall<Votes | null>(api.query.rootCommittee.voting, [imageHash], transformVotes);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'rootCommittee');
  const [proposalWeight, proposalLength] = useWeight(proposal);
>>>>>>> ternoa-master

  const [councilId, isMultiMembers] = useMemo(
    (): [string | null, boolean] => {
      const councilIds = allAccounts.filter((accountId) => members.includes(accountId));

      return [councilIds[0] || null, councilIds.length > 1];
    },
    [allAccounts, members]
  );

<<<<<<< HEAD
  if (!modLocation || !derive || !derive.votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = derive.votes;
=======
  if (!proposal || !votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = votes;
>>>>>>> ternoa-master

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
<<<<<<< HEAD
        proposal={derive.proposal}
=======
        proposal={proposal}
>>>>>>> ternoa-master
      />
      <td className='number'>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime value={remainingBlocks} />
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
<<<<<<< HEAD
            type={type}
=======
>>>>>>> ternoa-master
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
<<<<<<< HEAD
                proposal={derive.proposal}
                type={type}
=======
                proposal={proposal}
>>>>>>> ternoa-master
              />
            )
            : (
              <TxButton
                accountId={councilId}
                icon='times'
                label={t<string>('Close')}
                params={
<<<<<<< HEAD
                  api.tx[modLocation].close?.meta.args.length === 4
=======
                  api.tx.rootCommittee.close?.meta.args.length === 4
>>>>>>> ternoa-master
                    ? hasFailed
                      ? [imageHash, index, 0, 0]
                      : [imageHash, index, proposalWeight, proposalLength]
                    : [imageHash, index]
                }
<<<<<<< HEAD
                tx={api.tx[modLocation].closeOperational || api.tx[modLocation].close}
=======
                tx={api.tx.rootCommittee.closeOperational || api.tx.rootCommittee.close}
>>>>>>> ternoa-master
              />
            )
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
