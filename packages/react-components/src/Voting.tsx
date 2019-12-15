// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { Hash, Proposal } from '@polkadot/types/interfaces';
import { TxSource } from '@polkadot/react-hooks/types';
import { I18nProps, VotingType } from './types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Dropdown, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';

import translate from './translate';
import Button from './Button';
import ProposedAction from './ProposedAction';
import { isTreasuryProposalVote } from './util';

interface Props extends I18nProps {
  hash?: Hash;
  idNumber: BN | number;
  proposal?: Proposal | null;
  type: VotingType;
}

const { Democracy, Council, TechnicalCommittee } = VotingType;

function getVoteOptions ({ t }: Props): { text: React.ReactNode; value: boolean }[] {
  return [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ];
}

function Voting (props: Props): React.ReactElement<Props> {
  const { hash, idNumber, proposal, type, t } = props;

  const { api } = useApi();
  const [voteValue, setVoteValue] = useState(true);
  const voteOptions = getVoteOptions(props);

  let method: SubmittableExtrinsicFunction<'promise'>;
  let header: React.ReactNode;

  switch (props.type) {
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
      <Dropdown
        help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
        label={t('record my vote as')}
        options={voteOptions}
        onChange={setVoteValue}
        value={voteValue}
      />
    </TxModal>
  );
}

export default translate(Voting);
