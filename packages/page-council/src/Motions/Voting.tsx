// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash, Proposal, ProposalIndex, Votes } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { Button, Modal, ProposedAction, TxButton, VoteAccount } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle, useWeight } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import getMaxThreshold from './utils';

interface Props {
  hash: Hash;
  idNumber: ProposalIndex;
  isDisabled: boolean;
  members: string[];
  prime: AccountId | null;
  proposal: Proposal;
  votes: Votes | null;
}

function Voting ({ hash, idNumber, isDisabled, members, prime, proposal, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isVotingOpen, toggleVoting] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api } = useApi();
  const [proposalWeight, proposalLength] = useWeight(proposal);
  const ayeThreshold = getMaxThreshold({ isAye: true, members, threshold: votes?.threshold });
  const nayThreshold = getMaxThreshold({ isAye: false, members, threshold: votes?.threshold });
  
  // this account has voted on this motion already
  const hasVotedAye = useMemo(() => votes?.ayes.some((account) => accountId && account.toString() === accountId)
  , [accountId, votes?.ayes, votes?.nays]);
  const hasVotedNay = useMemo(() => votes?.nays.some((account) => accountId && account.toString() === accountId)
  , [accountId, votes?.ayes, votes?.nays]);

  // will the proposal pass if this member votes aye
  const willPass = (votes && !hasVotedAye && (ayeThreshold === votes.ayes.length + 1)) || false;
  // will the proposal fail if this member votes nay
  const willFail = (votes && !hasVotedNay && (nayThreshold === votes.nays.length + 1)) || false;

  const isPrime = prime?.toString() === accountId;

  const getExtrinsic = useCallback((aye: boolean) => {
    const voteExtrinsic = api.tx.council.vote(hash, idNumber, aye);

    // protect against older versions
    if (!api.tx.council.close) {
      return voteExtrinsic;
    }

    const closeExtrinsic = api.tx.council.close.meta.args.length === 4
      ? api.tx.council.close(hash, idNumber, proposalWeight, proposalLength)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore older version (2 params)
      : api.tx.council.close(hash, idNumber);

    return (aye && willPass || !aye && willFail)
    ? api.tx.utility.batch([voteExtrinsic, closeExtrinsic])
    : voteExtrinsic
  },
  [api, hash, idNumber, proposalLength, proposalWeight, willPass, willFail])

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
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <ProposedAction
                  idNumber={idNumber}
                  proposal={proposal}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The proposal that is being voted on. It will pass when the threshold is reached.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <VoteAccount
                  filter={members}
                  onChange={setAccountId}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council account for this vote. The selection is filtered by the current members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {isPrime && (
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
              isDisabled={isDisabled || hasVotedNay}
              label={ !hasVotedNay && willFail
                ? t<string>('Vote Nay & Close')
                : t<string>('Vote Nay')
              }
              onStart={toggleVoting}
            />
            <TxButton
              accountId={accountId}
              extrinsic={ayeExtrinsic}
              icon='check'
              isDisabled={isDisabled || hasVotedAye}
              label={ !hasVotedAye && willPass
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
        isDisabled={isDisabled}
        label={t<string>('Vote')}
        onClick={toggleVoting}
      />
    </>
  );
}

export default React.memo(Voting);
