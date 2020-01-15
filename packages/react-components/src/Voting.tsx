// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { Hash, Proposal } from '@polkadot/types/interfaces';
import { TxSource } from '@polkadot/react-hooks/types';
import { VotingType } from './types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import Button from './Button';
import ProposedAction from './ProposedAction';
import TxModal from './TxModalNew';
import VoteToggle from './VoteToggle';
import { isTreasuryProposalVote } from './util';

interface Props {
  hash?: Hash;
  idNumber: BN | number;
  proposal?: Proposal | null;
  type: VotingType;
}

const { Democracy, Council, TechnicalCommittee } = VotingType;

export default function Voting ({ hash, idNumber, proposal, type }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [voteValue, setVoteValue] = useState(true);

  let method: SubmittableExtrinsicFunction<'promise'>;
  let header: React.ReactNode;

  switch (type) {
    case Council:
      method = api.tx.council.vote;
      header = t('Vote on council motion');
      break;
    case TechnicalCommittee:
      method = api.tx.technicalCommittee.vote;
      header = t('Vote on technical committee motion');
      break;
    case Democracy:
    default:
      method = api.tx.democracy.vote;
      header = t('Vote on proposal');
      break;
  }

  const txModalState = useTxModal(
    type !== Democracy && !!hash
      ? (): TxSource => ({
        tx: method(hash.toString(), idNumber, voteValue),
        isSubmittable: !!hash
      })
      : (): TxSource => ({
        tx: method(idNumber, voteValue),
        isSubmittable: true
      }),
    [hash, idNumber, voteValue]
  );

  return (
    <TxModal
      {...txModalState}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <div className='ui--Row-buttons'>
            <Button
              isPrimary
              label={t('Vote')}
              icon='check'
              onClick={onOpen}
            />
          </div>
        ))
      }
      header={header}
      inputAddressLabel={t('Vote with account')}
      preContent={
        <>
          <ProposedAction
            expandNested={isTreasuryProposalVote(proposal)}
            idNumber={idNumber}
            isCollapsible
            proposal={proposal}
          />
          <br />
          <br />
        </>
      }
    >
      <VoteToggle
        onChange={setVoteValue}
        value={voteValue}
      />
    </TxModal>
  );
}
