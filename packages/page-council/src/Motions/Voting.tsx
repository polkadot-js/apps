// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash, Proposal, ProposalIndex, Votes } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, ProposedAction, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle, useWeight } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

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
  const [voteValue, setVoteValue] = useState(true);
  const { api } = useApi();
  const [proposalWeight, proposalLength] = useWeight(proposal);
  const ayeThreshold = getMaxThreshold({ isAye: true, members, threshold: votes?.threshold });
  const nayThreshold = getMaxThreshold({ isAye: false, members, threshold: votes?.threshold });
  // this account has not voted on this motion yet, or they are changing their vote
  const isNewVote = useMemo(() =>
    voteValue
      ? !votes?.ayes.some((account) => accountId && account.toString() === accountId)
      : !votes?.nays.some((account) => accountId && account.toString() === accountId)
  , [accountId, voteValue, votes?.ayes, votes?.nays]);
  // will the proposal pass if this member votes aye
  const willPass = (votes && voteValue && (ayeThreshold === votes.ayes.length + 1)) || false;
  // will the proposal fail if this member votes nay
  const willFail = (votes && !voteValue && (nayThreshold === votes.nays.length + 1)) || false;

  useEffect((): void => {
    isVotingOpen && setVoteValue(true);
  }, [isVotingOpen]);

  const _onChangeVote = useCallback(
    (vote?: boolean) => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  const isPrime = prime?.toString() === accountId;

  // vote and close if this vote ends the vote
  const extrinsic = useMemo(() => {
    const voteExtrinsic = api.tx.council.vote(hash, idNumber, voteValue);
    const closeExtrinsic = api.tx.council.close.meta.args.length === 4
      ? api.tx.council.close(hash, idNumber, proposalWeight, proposalLength)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore older version (2 params)
      : api.tx.council.close(hash, idNumber);

    return willPass || willFail
      ? api.tx.utility.batch([voteExtrinsic, closeExtrinsic])
      : voteExtrinsic;
  },
  [api, hash, idNumber, proposalLength, proposalWeight, voteValue, willFail, willPass]);

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
            <Modal.Columns>
              <Modal.Column>
                <VoteToggle
                  onChange={_onChangeVote}
                  value={voteValue}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The vote to record for this proposal, either for or against.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {isPrime && (
              <article className='warning'>
                <div>{t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')}</div>
              </article>
            )}
            {willFail && isNewVote && (
              <article className='full warning'>
                <div>{t<string>('Your "Nay" vote will end this proposal. This will close it.')}</div>
              </article>
            )}
            {willPass && isNewVote && (
              <article className='full warning'>
                <div>{t<string>('Your "Aye" vote will end this proposal. This will close it.')}</div>
              </article>
            )}
            {!isNewVote && (
              <article className='full warning'>
                {voteValue
                  ? <div>{t<string>('This account has allready voted Aye on this motion. Voting Aye again would not change anything.')}</div>
                  : <div>{t<string>('This account has allready voted Nay on this motion. Voting Nay again would not change anything.')}</div>
                }
              </article>
            )}
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            aye={voteValue}
            extrinsic={extrinsic}
            isClosing={willPass || willFail}
            isDisabled={!isNewVote}
            onClick={toggleVoting}
          />
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
