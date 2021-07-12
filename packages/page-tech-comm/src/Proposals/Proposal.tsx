// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, Hash } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { AddressMini, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useCollectiveInstance, useVotingStatus, useWeight } from '@polkadot/react-hooks';
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
  type: 'membership' | 'technicalCommittee';
}

function Proposal ({ className = '', imageHash, members, prime, type }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const derive = useCall<DeriveCollectiveProposal>(api.derive[type].proposal, [imageHash]);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(derive?.votes, members.length, type);
  const [proposalWeight, proposalLength] = useWeight(derive?.proposal);
  const modLocation = useCollectiveInstance(type);

  const [councilId, isMultiMembers] = useMemo(
    (): [string | null, boolean] => {
      const councilIds = allAccounts.filter((accountId) => members.includes(accountId));

      return [councilIds[0] || null, councilIds.length > 1];
    },
    [allAccounts, members]
  );

  if (!modLocation || !derive || !derive.votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = derive.votes;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={derive.proposal}
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
            type={type}
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
                proposal={derive.proposal}
                type={type}
              />
            )
            : (
              <TxButton
                accountId={councilId}
                icon='times'
                label={t<string>('Close')}
                params={
                  api.tx[modLocation].close?.meta.args.length === 4
                    ? hasFailed
                      ? [imageHash, index, 0, 0]
                      : [imageHash, index, proposalWeight, proposalLength]
                    : [imageHash, index]
                }
                tx={api.tx[modLocation].closeOperational || api.tx[modLocation].close}
              />
            )
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
