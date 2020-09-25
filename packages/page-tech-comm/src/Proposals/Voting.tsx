// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Hash, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle, useWeight } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash | string;
  members: string[];
  prime?: AccountId | null;
  proposal: ProposalType;
  proposalId: BN | number;
  votes: Votes;
}

function Voting ({ hash, members, prime, proposal, proposalId, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
  const { api } = useApi();
  const [proposalWeight, proposalLength] = useWeight(proposal);

  // this account has voted on this motion already
  const hasVotedAye = useMemo(() => votes?.ayes.some((account) => accountId && account.toString() === accountId)
    , [accountId, votes]);
  const hasVotedNay = useMemo(() => votes?.nays.some((account) => accountId && account.toString() === accountId)
    , [accountId, votes]);

  // will the proposal pass if this member votes aye now
  const willPass = (!hasVotedAye && votes?.threshold.gten(votes?.ayes.length + 1)) || false;
  // will the proposal fail if this member votes nay now
  const willFail = (!hasVotedNay && votes?.threshold.gten(votes?.nays.length + 1)) || false;

  const getExtrinsic = useCallback((aye: boolean) => {
    const voteExtrinsic = api.tx.technicalCommittee.vote(hash, proposalId, aye);

    // protect against older versions
    if (!api.tx.technicalCommittee.close) {
      return voteExtrinsic;
    }

    const closeExtrinsic = api.tx.technicalCommittee.close.meta.args.length === 4
      ? api.tx.technicalCommittee.close(hash, proposalId, proposalWeight, proposalLength)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore older version (2 params)
      : api.tx.technicalCommittee.close(hash, proposalId);

    return (aye && willPass) || (!aye && willFail)
      ? api.tx.utility.batch([voteExtrinsic, closeExtrinsic])
      : voteExtrinsic;
  },
  [api, hash, proposalId, proposalLength, proposalWeight, willPass, willFail]);

  const ayeExtrinsic = useMemo(
    () => getExtrinsic(true),
    [getExtrinsic]
  );

  const nayExtrinsic = useMemo(
    () => getExtrinsic(false),
    [getExtrinsic]
  );

  if (!hasAccounts) {
    return null;
  }

  return (
    <>
      {isVotingOpen && (
        <Modal
          header={t<string>('Vote on proposal')}
          size='small'
        >
          <Modal.Content>
            <VoteAccount
              filter={members}
              onChange={setAccountId}
            />
            {(accountId === prime?.toString()) && (
              <article className='warning'>
                <div>{t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')}</div>
              </article>
            )}
            {hasVotedAye && (
              <article className='full warning'>
                <div>{t<string>('You have previously voted "Aye" on this proposal. You can change your vote.')}</div>
              </article>
            )}
            {hasVotedNay && (
              <article className='full warning'>
                <div>{t<string>('You have previously voted "Nay" on this proposal. You can change your vote.')}</div>
              </article>
            )}
            {willFail && (
              <article className='full warning'>
                <div>{t<string>('Voting "Nay" would end this proposal and close it.')}</div>
              </article>
            )}
            {willPass && (
              <article className='full warning'>
                <div>{t<string>('Voting "Aye" would end this proposal and close it.')}</div>
              </article>
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleVoting}>
            <TxButton
              accountId={accountId}
              extrinsic={nayExtrinsic}
              icon='ban'
              isDisabled={hasVotedNay}
              label={ willFail
                ? t<string>('Vote Nay & Close')
                : t<string>('Vote Nay')
              }
              onStart={toggleVoting}
            />
            <TxButton
              accountId={accountId}
              extrinsic={ayeExtrinsic}
              icon='check'
              isDisabled={hasVotedAye}
              label={ willPass
                ? t<string>('Vote Aye & Close')
                : t<string>('Vote Aye')
              }
              onStart={toggleVoting}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='check'
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
