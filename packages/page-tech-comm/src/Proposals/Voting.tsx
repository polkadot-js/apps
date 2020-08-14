// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, VoteAccount, VoteActions, VoteToggle } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle, useWeight } from '@polkadot/react-hooks';
import { isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  hash: Hash | string;
  prime?: AccountId | null;
  proposal: ProposalType;
  proposalId: BN | number;
  votes: Votes;
}

function Voting ({ hash, prime, proposal, proposalId, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVotingOpen, toggleVoting] = useToggle();
  const [voteValue, setVoteValue] = useState(true);
  const { api } = useApi();
  const [proposalWeight, proposalLength] = useWeight(proposal);
  // will the proposal pass if this member votes aye
  const willPass = (voteValue && votes?.threshold.eqn(votes?.ayes.length + 1)) || false;
  // will the proposal fail if this member votes nay
  const willFail = (!voteValue && votes?.threshold.eqn(votes?.nays.length + 1)) || false;

  useEffect((): void => {
    isVotingOpen && setVoteValue(true);
  }, [isVotingOpen]);

  const _onChangeVote = useCallback(
    (vote?: boolean): void => setVoteValue(isBoolean(vote) ? vote : true),
    []
  );

  const isPrime = accountId === prime?.toString();

  const voteExtrinsic = api.tx.technicalCommittee.vote(hash, proposalId, voteValue);
  const closeExtrinsic = api.tx.council.close.meta.args.length === 4
    ? api.tx.technicalCommittee.close(hash, proposalId, proposalWeight, proposalLength)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore older version (2 params)
    : api.tx.technicalCommittee.close(hash, proposalId);

  // vote and close if this vote ends the vote
  const extrinsic = useMemo(() =>
    willPass || willFail
      ? api.tx.utility.batch([voteExtrinsic, closeExtrinsic])
      : voteExtrinsic
  , [api.tx.utility, closeExtrinsic, voteExtrinsic, willFail, willPass]);

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
            <VoteAccount onChange={setAccountId} />
            <VoteToggle
              onChange={_onChangeVote}
              value={voteValue}
            />
            {isPrime && (
              <article className='warning'>
                <div>{t<string>('You are voting with this collective\'s prime account. The vote will be the default outcome in case of any abstentions.')}</div>
              </article>
            )}
            {willFail && (
              <article className='warning'>
                <div>{t<string>('Your "Nay" vote will end this proposal. This will close it.')}</div>
              </article>
            )}
            {willPass && (
              <article className='warning'>
                <div>{t<string>('Your "Aye" vote will end this proposal. This will close it.')}</div>
              </article>
            )}
          </Modal.Content>
          <VoteActions
            accountId={accountId}
            aye={voteValue}
            extrinsic={extrinsic}
            isClosing={willPass || willFail}
            onClick={toggleVoting}
            params={[hash, proposalId, voteValue]}
          />
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
